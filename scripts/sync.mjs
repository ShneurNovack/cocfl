#!/usr/bin/env node
/**
 * Daily Chabad on Campus directory sync.
 *
 * Reads the authoritative center list (data/centers.json), fetches the latest
 * public data for every center that has a saved cocHouseId, normalizes it,
 * and writes data/coc/<houseId>.json ONLY when the normalized data changed.
 *
 * Safety rules:
 *  - A failed request, non-200, malformed JSON, or a response that fails
 *    validation never overwrites or deletes the stored record for that center.
 *  - If the API looks globally down (every house fails), nothing is written.
 *  - Program rosters (JewishU) are only replaced when the response looks sane.
 *  - Every run that changes data or hits an error appends to data/sync-log.json.
 *
 * Usage:
 *   node scripts/sync.mjs                 live sync
 *   node scripts/sync.mjs --dry-run       fetch + compare, write nothing
 *   node scripts/sync.mjs --fixture <api.json> --program-fixtures <dir> --media-cache <dir>
 *                                         run against saved API snapshots
 *
 * Exit code is 1 when any center failed, so the GitHub Action is marked red
 * (and GitHub emails the repo owner) while still committing good updates.
 */
import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'data');
const COC_DIR = path.join(DATA, 'coc');
const MEDIA_DIR = path.join(ROOT, 'public', 'media', 'coc');
const MEDIA_URL = '/media/coc';
const API = 'https://api.chabadoncampus.org/api/1.0';
// Program rosters from the public EduChabadHouses endpoint, keyed by our program slug.
//  1 = JewishU: verified, it is the exact list behind jewishu.org/locations.
//  2 = Your Israel, 3 = Sinai Scholars Society: inferred (the API has no public
//      program-name lookup). Every Florida center confirmed on its own website to
//      run Sinai Scholars / Your Israel appears in these lists, and a center's own
//      portal shows Sinai Scholars but not Your Israel, matching lists 3 and 2.
//      If these ever look wrong, delete the entry here and the site falls back to
//      the hand-kept list in src/data/programs.ts.
const PROGRAMS = {
  jewishu: { eduProgramId: 1, minRows: 20, courses: true },
  'your-israel': { eduProgramId: 2, minRows: 10, courses: false },
  'sinai-scholars': { eduProgramId: 3, minRows: 20, courses: false },
};
const LOG_LIMIT = 120;

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : null);
const DRY = flag('--dry-run');
const FIXTURE = opt('--fixture');
const PROGRAM_FIXTURES = opt('--program-fixtures'); // dir with <program-slug>.json
const MEDIA_CACHE = opt('--media-cache'); // dir of raw files named sha256(url)[:16]
const NO_MEDIA = flag('--no-media');

const log = (...m) => console.log(new Date().toISOString(), ...m);

// ---------- fetching ----------
let fixture = null;
async function loadFixture() {
  if (FIXTURE && !fixture) fixture = JSON.parse(await readFile(FIXTURE, 'utf8'));
}

async function getJSON(url, { retries = 2 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 30000);
      const res = await fetch(url, {
        signal: ctrl.signal,
        headers: { Accept: 'application/json', 'User-Agent': 'chabadoncampusfl.org directory sync' },
      });
      clearTimeout(t);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      lastErr = e;
      if (attempt < retries) await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
    }
  }
  throw lastErr;
}

async function fetchHouse(id) {
  if (FIXTURE) {
    await loadFixture();
    const h = fixture.houses[String(id)];
    if (!h) throw new Error('not in fixture');
    return h;
  }
  return getJSON(`${API}/ChabadHouses/Public/${id}`);
}

async function fetchCampus(id) {
  if (FIXTURE) {
    await loadFixture();
    const c = fixture.campuses[String(id)];
    if (!c) throw new Error('not in fixture');
    return c;
  }
  return getJSON(`${API}/Campuses/Public/${id}`);
}

async function fetchHouseLocations() {
  if (FIXTURE) {
    await loadFixture();
    return fixture.housesList || [];
  }
  return getJSON(`${API}/ChabadHouses/public`);
}

async function fetchProgramRoster(slug, eduProgramId) {
  if (PROGRAM_FIXTURES) {
    const f = path.join(PROGRAM_FIXTURES, `${slug}.json`);
    return existsSync(f) ? JSON.parse(await readFile(f, 'utf8')) : null;
  }
  if (FIXTURE) return null;
  const j = await getJSON(
    `${API}/EduChabadHouses/public?eduProgramId=${eduProgramId}&page=1&results=1000&sortByOption=chabadHouseName`,
  );
  return j.payload || j;
}

// ---------- normalizing ----------
const clean = (s) => (typeof s === 'string' ? s.replace(/\s+/g, ' ').trim() : s ?? null);
const nonEmpty = (s) => (clean(s) ? clean(s) : null);
const httpsUrl = (u) => {
  u = nonEmpty(u);
  if (!u) return null;
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  return u.replace(/^http:\/\//i, 'https://');
};

function normalizeStaff(shluchim = []) {
  return shluchim
    .filter((s) => nonEmpty(s.fullName))
    .map((s) => ({
      title: nonEmpty(s.titleDisplay) || nonEmpty(s.title),
      name: clean(s.fullName),
      role: nonEmpty(s.shliachPositionDisplay),
      photo: httpsUrl(s.profileImageURL),
      primary: !!s.isPrimary,
    }));
}

function normalizeCampus(link, detail) {
  const d = detail && !detail.error ? detail : {};
  const num = (v) => (typeof v === 'number' && v > 0 ? v : null);
  return {
    id: link.campusID,
    name: clean(d.name || link.campusName),
    nickname: nonEmpty(d.nickname),
    primary: !!link.isPrimary,
    fullTime: !!link.isFullTime,
    distance: nonEmpty(link.distance),
    website: httpsUrl(d.websiteURL),
    publicInstitution: typeof d.isInstitutionControlPublic === 'boolean' ? d.isInstitutionControlPublic : null,
    residency: nonEmpty(d.studentResidencyType),
    undergrad: num(d.undergradPopulation),
    grad: num(d.graduatePopulation),
    jewishUndergrad: num(d.jewishUndergradPopulation),
    jewishGrad: num(d.jewishGraduatePopulation),
    chabadGroupStatus: nonEmpty(d.chabadStudentGroupStatus),
    studentLife: (d.jewishStudentLife || []).map((x) => ({
      name: clean(x.name),
      providers: (x.providers || []).map(clean).filter(Boolean),
    })),
    programLevels: d.programLevels || [],
  };
}

function normalizeHouse(h, campusDetails, locations) {
  const a = h.address || {};
  const address = a.hideFromPublic
    ? null
    : {
        street: [nonEmpty(a.address1), nonEmpty(a.address2)].filter(Boolean).join(', ') || null,
        city: nonEmpty(a.city),
        state: nonEmpty(a.state),
        zip: nonEmpty(a.zip),
        country: nonEmpty(a.country),
      };
  const loc = locations.find((x) => x.id === h.id)?.location;
  const social = (h.socialMediaAccounts || [])
    .filter((s) => !s.optOut && nonEmpty(s.url))
    .map((s) => ({ type: s.type, url: httpsUrl(s.url) }));
  const campuses = (h.campuses || [])
    .map((c) => normalizeCampus(c, campusDetails[c.campusID]))
    .sort((x, y) => Number(y.primary) - Number(x.primary) || x.name.localeCompare(y.name));
  return {
    houseId: h.id,
    name: clean(h.name),
    cocSlug: nonEmpty(h.slug),
    website: httpsUrl(h.websiteURL),
    donateUrl: httpsUrl(h.donateURL),
    logo: httpsUrl(h.logoURL),
    image: httpsUrl(h.buildingImageURL),
    address,
    location:
      !a.hideFromPublic && loc && typeof loc.latitude === 'number' ? { lat: loc.latitude, lng: loc.longitude } : null,
    phone: nonEmpty(h.phone?.value),
    email: nonEmpty(h.email?.value),
    region: nonEmpty(h.region?.name),
    timezone: nonEmpty(h.timezoneID),
    staff: normalizeStaff(h.shluchim),
    social,
    campuses,
  };
}

function validateHouse(raw, id) {
  if (!raw || typeof raw !== 'object') return 'empty response';
  if (raw.id !== id) return `id mismatch (got ${raw.id})`;
  if (!nonEmpty(raw.name)) return 'missing name';
  if (!Array.isArray(raw.campuses)) return 'missing campuses';
  if (!Array.isArray(raw.shluchim)) return 'missing shluchim';
  return null;
}

// deterministic JSON so change detection ignores key order
function stable(v) {
  if (Array.isArray(v)) return `[${v.map(stable).join(',')}]`;
  if (v && typeof v === 'object')
    return `{${Object.keys(v)
      .sort()
      .map((k) => JSON.stringify(k) + ':' + stable(v[k]))
      .join(',')}}`;
  return JSON.stringify(v) ?? 'null';
}
const hash = (v) => createHash('sha256').update(stable(v)).digest('hex').slice(0, 16);

async function readJSON(p, fallback) {
  try {
    return JSON.parse(await readFile(p, 'utf8'));
  } catch {
    return fallback;
  }
}

// ---------- media mirroring ----------
// Images are downloaded, resized to WebP and served from our own domain so
// pages never wait on (or break because of) the remote image host.
const VARIANTS = {
  logo: [{ suffix: 'logo', w: 320, h: 320, fit: 'inside' }],
  image: [
    { suffix: 'w1280', w: 1280, h: 1280, fit: 'inside' },
    { suffix: 'w640', w: 640, h: 640, fit: 'inside' },
  ],
  staff: [{ suffix: 'staff', w: 240, h: 240, fit: 'cover' }],
};
const urlKey = (u) => createHash('sha256').update(u).digest('hex').slice(0, 16);

let sharpLib;
async function getSharp() {
  if (!sharpLib) sharpLib = (await import('sharp')).default;
  return sharpLib;
}

async function downloadBytes(url) {
  if (MEDIA_CACHE) return readFile(path.join(MEDIA_CACHE, urlKey(url)));
  const res = await fetch(url, { headers: { 'User-Agent': 'chabadoncampusfl.org directory sync' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Returns { src, width, height, srcset? } or throws. Reuses files already on disk. */
async function mirror(url, kind) {
  const key = urlKey(url);
  const variants = VARIANTS[kind];
  const out = [];
  let bytes = null;
  for (const v of variants) {
    const name = `${key}-${v.suffix}.webp`;
    const file = path.join(MEDIA_DIR, name);
    const metaFile = file + '.json';
    if (existsSync(file) && existsSync(metaFile)) {
      out.push({ ...(JSON.parse(await readFile(metaFile, 'utf8'))), src: `${MEDIA_URL}/${name}` });
      continue;
    }
    bytes ??= await downloadBytes(url);
    const sharp = await getSharp();
    const img = sharp(bytes, { failOn: 'none' }).rotate();
    const meta = await img.metadata();
    if (!meta.width || !meta.height) throw new Error('not an image');
    const buf = await img
      .resize({ width: v.w, height: v.h, fit: v.fit, withoutEnlargement: true, position: 'attention' })
      .webp({ quality: v.suffix === 'logo' ? 90 : 78 })
      .toBuffer({ resolveWithObject: true });
    if (!DRY) {
      await mkdir(MEDIA_DIR, { recursive: true });
      await writeFile(file, buf.data);
      await writeFile(metaFile, JSON.stringify({ width: buf.info.width, height: buf.info.height }));
    }
    out.push({ src: `${MEDIA_URL}/${name}`, width: buf.info.width, height: buf.info.height });
  }
  const [main, ...rest] = out;
  return {
    src: main.src,
    width: main.width,
    height: main.height,
    ...(rest.length ? { srcset: out.map((o) => `${o.src} ${o.width}w`).join(', ') } : {}),
  };
}

async function attachMedia(data, prevData, warnings, centerId) {
  const prevMedia = (url) => {
    if (!prevData) return null;
    if (prevData.logo === url) return prevData.logoLocal;
    if (prevData.image === url) return prevData.imageLocal;
    return prevData.staff?.find((s) => s.photo === url)?.photoLocal ?? null;
  };
  const tryMirror = async (url, kind) => {
    if (!url || NO_MEDIA) return prevMedia(url);
    try {
      return await mirror(url, kind);
    } catch (e) {
      warnings.push({ center: centerId, media: url, error: e.message });
      return prevMedia(url);
    }
  };
  data.logoLocal = await tryMirror(data.logo, 'logo');
  data.imageLocal = await tryMirror(data.image, 'image');
  for (const s of data.staff) s.photoLocal = await tryMirror(s.photo, 'staff');
}

async function pruneMedia() {
  if (!existsSync(MEDIA_DIR)) return 0;
  const used = new Set();
  for (const f of await readdir(COC_DIR)) {
    const rec = await readJSON(path.join(COC_DIR, f), null);
    const d = rec?.data;
    if (!d) continue;
    for (const m of [d.logoLocal, d.imageLocal, ...(d.staff || []).map((s) => s.photoLocal)]) {
      if (!m) continue;
      used.add(path.basename(m.src));
      for (const part of (m.srcset || '').split(',')) if (part.trim()) used.add(path.basename(part.trim().split(' ')[0]));
    }
  }
  let removed = 0;
  for (const f of await readdir(MEDIA_DIR)) {
    const base = f.endsWith('.json') ? f.slice(0, -5) : f;
    if (!used.has(base)) {
      if (!DRY) await unlink(path.join(MEDIA_DIR, f));
      removed++;
    }
  }
  return removed;
}

// ---------- main ----------
async function main() {
  const { centers } = JSON.parse(await readFile(path.join(DATA, 'centers.json'), 'utf8'));
  const mapped = centers.filter((c) => Number.isInteger(c.cocHouseId));
  log(`Sync starting: ${mapped.length} mapped centers, ${centers.length - mapped.length} local-only${DRY ? ' (dry run)' : ''}`);
  await mkdir(COC_DIR, { recursive: true });

  let locations = [];
  try {
    const list = await fetchHouseLocations();
    if (Array.isArray(list) && list.length > 0) locations = list;
  } catch (e) {
    log('Warning: could not load house locations list:', e.message);
  }

  const changed = [];
  const unchanged = [];
  const errors = [];
  const warnings = [];
  const now = new Date().toISOString();

  for (const c of mapped) {
    const id = c.cocHouseId;
    const file = path.join(COC_DIR, `${id}.json`);
    try {
      const raw = await fetchHouse(id);
      const problem = validateHouse(raw, id);
      if (problem) throw new Error(`invalid house response: ${problem}`);

      const prev = await readJSON(file, null);
      const details = {};
      const keptFromPrev = {};
      for (const link of raw.campuses) {
        try {
          details[link.campusID] = await fetchCampus(link.campusID);
        } catch (e) {
          // keep the previously stored campus detail instead of dropping fields
          const prevCampus = prev?.data?.campuses?.find((x) => x.id === link.campusID);
          if (prevCampus) keptFromPrev[link.campusID] = prevCampus;
          errors.push({ center: c.id, houseId: id, campusId: link.campusID, error: `campus fetch failed: ${e.message}` });
        }
      }
      const data = normalizeHouse(raw, details, locations);
      data.campuses = data.campuses.map((cp) => keptFromPrev[cp.id] || cp);

      // a failed locations request must not wipe a known map location
      if (!data.location && locations.length === 0 && prev?.data?.location && data.address) {
        data.location = prev.data.location;
      }

      await attachMedia(data, prev?.data, warnings, c.id);

      const h = hash(data);
      if (prev && prev.hash === h) {
        unchanged.push(c.id);
        continue;
      }
      const record = { houseId: id, center: c.id, hash: h, updatedAt: now, source: `${API}/ChabadHouses/Public/${id}`, data };
      if (!DRY) await writeFile(file, JSON.stringify(record, null, 2) + '\n');
      changed.push({ center: c.id, houseId: id, fields: diffKeys(prev?.data, data) });
      log(`Updated ${c.id} (house ${id})`);
    } catch (e) {
      errors.push({ center: c.id, houseId: id, error: e.message });
      log(`ERROR ${c.id} (house ${id}): ${e.message}. Keeping stored data.`);
    }
  }

  // ---- program rosters (EduChabadHouses) ----
  const programChanges = [];
  const slugToCenter = {};
  for (const c of mapped) {
    const rec = await readJSON(path.join(COC_DIR, `${c.cocHouseId}.json`), null);
    if (rec?.data?.cocSlug) slugToCenter[rec.data.cocSlug] = c.id;
  }
  const programsFile = path.join(DATA, 'coc-programs.json');
  const programsState = await readJSON(programsFile, { programs: {} });
  let programsDirty = false;
  for (const [slug, cfg] of Object.entries(PROGRAMS)) {
    try {
      const roster = await fetchProgramRoster(slug, cfg.eduProgramId);
      if (!roster) continue;
      const rows = roster.results || [];
      const total = roster.numberOfRows ?? rows.length;
      if (!Array.isArray(rows) || total < cfg.minRows) throw new Error(`roster looks wrong (${total} rows)`);
      const offeredAt = rows
        .filter((r) => slugToCenter[r.chabadHouseSlug])
        .map((r) => ({
          center: slugToCenter[r.chabadHouseSlug],
          slug: r.chabadHouseSlug,
          ...(cfg.courses ? { courses: r.numOfCourses || 0, currentCourses: r.numOfCurrentCourses || 0 } : {}),
        }))
        .sort((a, b) => a.center.localeCompare(b.center));
      if (hash(programsState.programs?.[slug]?.offeredAt) !== hash(offeredAt)) {
        programsState.programs[slug] = { source: `EduChabadHouses eduProgramId=${cfg.eduProgramId}`, offeredAt };
        programsDirty = true;
        programChanges.push({ program: slug, centers: offeredAt.map((x) => x.center) });
        log(`Updated ${slug} roster: ${offeredAt.length} Florida centers`);
      }
    } catch (e) {
      errors.push({ program: slug, error: e.message });
      log(`ERROR ${slug} roster: ${e.message}. Keeping stored roster.`);
    }
  }
  if (programsDirty) {
    programsState.updatedAt = now;
    if (!DRY) await writeFile(programsFile, JSON.stringify(programsState, null, 2) + '\n');
  }
  const programChange = programChanges.length ? programChanges : null;

  // ---- media cleanup (only after a clean run, so nothing in use is removed) ----
  if (!errors.length && !warnings.length && !NO_MEDIA) {
    const removed = await pruneMedia();
    if (removed) log(`Pruned ${removed} unused media files`);
  }
  for (const w of warnings) log(`Warning ${w.center}: image ${w.media}: ${w.error}`);

  // ---- log ----
  const summary = { at: now, changed, programChange, errors, warnings, unchanged: unchanged.length };
  if (!DRY && (changed.length || errors.length || warnings.length || programChange)) {
    const logFile = path.join(DATA, 'sync-log.json');
    const history = await readJSON(logFile, []);
    history.unshift(summary);
    await writeFile(logFile, JSON.stringify(history.slice(0, LOG_LIMIT), null, 2) + '\n');
  }
  log(`Done. changed=${changed.length} unchanged=${unchanged.length} errors=${errors.length}`);

  if (process.env.GITHUB_STEP_SUMMARY) {
    const lines = [
      `### Directory sync ${now}`,
      `- Changed: ${changed.map((x) => `${x.center} (${x.fields.join(', ') || 'new'})`).join('; ') || 'none'}`,
      `- Unchanged: ${unchanged.length}`,
      `- Program rosters: ${programChange ? programChange.map((p) => p.program).join(', ') + ' updated' : 'unchanged'}`,
      `- Errors: ${errors.map((e) => `${e.center || e.program}: ${e.error}`).join('; ') || 'none'}`,
    ];
    await writeFile(process.env.GITHUB_STEP_SUMMARY, lines.join('\n') + '\n', { flag: 'a' });
  }
  if (errors.length) process.exitCode = 1;
}

function diffKeys(a, b) {
  if (!a) return [];
  return Object.keys(b).filter((k) => stable(a[k]) !== stable(b[k]));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
