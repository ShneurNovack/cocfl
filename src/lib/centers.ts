// Builds the view model for every center from:
//   data/centers.json        authoritative list + local fallbacks/overrides
//   data/coc/<houseId>.json  synced Chabad on Campus API data
//   data/coc-programs.json   synced program rosters
//   src/data/programs.ts     program content
import centersFile from '../../data/centers.json';
import programRosters from '../../data/coc-programs.json';
import { programs, type Program } from '../data/programs';

const cocRecords = import.meta.glob('../../data/coc/*.json', { eager: true, import: 'default' }) as Record<string, any>;
const cocByHouse: Record<number, any> = {};
for (const rec of Object.values(cocRecords)) cocByHouse[rec.houseId] = rec;

export type Region = 'north' | 'central' | 'gulf' | 'south';
export const REGIONS: Record<Region, { name: string; blurb: string }> = {
  north: { name: 'North Florida', blurb: 'Gainesville, Tallahassee and Jacksonville' },
  central: { name: 'Central Florida', blurb: 'Orlando and Winter Park' },
  gulf: { name: 'Tampa Bay & Southwest Florida', blurb: 'Tampa and Fort Myers' },
  south: { name: 'South Florida', blurb: 'Miami, Coral Gables, Davie and Boca Raton' },
};
const REGION_OF: Record<string, Region> = {
  uf: 'north', fsu: 'north', unf: 'north',
  ucf: 'central', rollins: 'central',
  usf: 'gulf', ut: 'gulf', fgcu: 'gulf',
  um: 'south', 'um-undergrad': 'south', fiu: 'south', fau: 'south', nsu: 'south', mdc: 'south',
};

export type MediaRef = { src: string; width: number; height: number; srcset?: string } | null;
export type Staff = { title: string | null; name: string; role: string | null; photo: MediaRef; primary: boolean };
export type Campus = {
  id: number | string;
  name: string;
  abbr: string | null;
  primary: boolean;
  website: string | null;
  anchor: string;
  fromApi: boolean;
  distance?: string | null;
  info?: CampusInfo | null;
};
export type CampusInfo = {
  publicInstitution: boolean | null;
  residency: string | null;
  undergrad: number | null;
  grad: number | null;
  levels: string[];
  studentLife: string[];
};
export type Amenity = { key: string; label: string; byChabad: boolean; onCampus: boolean };
export type Center = {
  id: string;
  slug: string;
  url: string;
  hasApi: boolean;
  officialName: string;
  shortName: string;
  primaryCampus: Campus;
  campuses: Campus[];
  otherCampuses: Campus[];
  city: string;
  region: Region;
  regionName: string;
  address: { street: string | null; city: string | null; state: string | null; zip: string | null } | null;
  location: { lat: number; lng: number } | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  donateUrl: string | null;
  logo: MediaRef;
  image: MediaRef;
  staff: Staff[];
  directorsLine: string;
  social: { type: string; url: string }[];
  amenities: Amenity[];
  programs: { program: Program; confirmed: boolean }[];
  jewishU: { courses: number; currentCourses: number; locationUrl: string } | null;
  searchText: string;
  updatedAt: string | null;
  aliases: string[];
  seoTitle: string | null;
};

/**
 * Profile images on Chabad on Campus that are stock placeholders ("camera shy"
 * graphics, generic avatars) rather than real photos. These render as a plain
 * gray box instead. Add new ones here by their source URL.
 */
const PLACEHOLDER_PHOTOS = new Set([
  'https://cocistorage.blob.core.windows.net/prod/profile/uwakn_d7QIZz~ImWmYaPNB.png',
  'https://cocistorage.blob.core.windows.net/prod/profile/rRZ~XPKizVZohL1rRziOch.png',
  'https://cocistorage.blob.core.windows.net/prod/profile/iUPe4KIcXP~~ahINEqvzwx.png',
]);
const isPlaceholderPhoto = (url: string | null | undefined) => !!url && PLACEHOLDER_PHOTOS.has(url);

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const AMENITY_LABELS: Record<string, string> = {
  'Jewish student lounge': 'Jewish student lounge',
  'Jewish student housing': 'Jewish student housing',
  'Full Kosher meal plan (3 meals a day)': 'Full kosher meal plan',
  'Daily Kosher meal plan (1 meal a day)': 'Daily kosher meal plan',
  'Limited Kosher meal plan (1 or 2 meals a week)': 'Kosher meals once or twice a week',
  'Kosher restaurant': 'Kosher dining',
  'Packaged kosher food': 'Packaged kosher food',
  'Kosher food truck': 'Kosher food truck',
  'Kosher for Passover meal plan': 'Kosher for Passover meals',
  'Shabbat and holidays minyan': 'Shabbat and holiday services',
  'Daily minyan': 'Daily minyan (prayer services)',
};
export const KOSHER_KEYS = [
  'Full Kosher meal plan (3 meals a day)',
  'Daily Kosher meal plan (1 meal a day)',
  'Limited Kosher meal plan (1 or 2 meals a week)',
  'Kosher restaurant',
  'Packaged kosher food',
  'Kosher food truck',
  'Kosher for Passover meal plan',
];

function cleanAbbr(nick: string | null, name: string): string | null {
  if (!nick) return null;
  const first = nick.split(/,| or /)[0].trim();
  if (!first || first.length > 10 || first.toLowerCase() === name.toLowerCase()) return null;
  if (/chabad/i.test(first)) return null;
  return /^[a-z]+$/.test(first) ? first.toUpperCase() : first;
}

function titleName(s: Staff) {
  const parts = s.name.split(' ');
  return { first: parts.slice(0, -1).join(' ') || s.name, last: parts.length > 1 ? parts[parts.length - 1] : '' };
}

// "Rabbi Berl & Chanie Goldman, Rabbi Aaron & Pessie Notik"
function directorsLine(staff: Staff[]): string {
  const byLast = new Map<string, Staff[]>();
  for (const s of staff) {
    const { last } = titleName(s);
    const k = last || s.name;
    if (!byLast.has(k)) byLast.set(k, []);
    byLast.get(k)!.push(s);
  }
  const couples: string[] = [];
  for (const [last, people] of byLast) {
    const men = people.filter((p) => /rabbi/i.test(p.title || ''));
    const women = people.filter((p) => !/rabbi/i.test(p.title || ''));
    // pair rabbis with spouses in order; any extras listed on their own
    const n = Math.max(men.length, women.length);
    for (let i = 0; i < n; i++) {
      const m = men[i];
      const w = women[i];
      if (m && w) couples.push(`Rabbi ${titleName(m).first} & ${titleName(w).first} ${last}`);
      else if (m) couples.push(`Rabbi ${m.name}`);
      else if (w) couples.push(`${w.title ? w.title + ' ' : ''}${w.name}`);
    }
  }
  return couples.join(', ');
}

type Roster = { offeredAt: { center: string; courses?: number; currentCourses?: number; slug?: string }[] };
const rosters = (programRosters as any).programs as Record<string, Roster>;

export function programCenterIds(p: Program, allIds: string[]): { ids: string[]; all: boolean } {
  if (p.offeredAt === 'all') return { ids: allIds, all: true };
  if (typeof p.offeredAt === 'string' && p.offeredAt.startsWith('api:')) {
    const key = p.offeredAt.slice(4);
    return { ids: (rosters[key]?.offeredAt || []).map((x) => x.center), all: false };
  }
  return { ids: p.offeredAt as string[], all: false };
}

function build(): Center[] {
  const list = (centersFile as any).centers as any[];
  const allIds = list.map((c) => c.id);
  return list.map((c) => {
    const rec = c.cocHouseId ? cocByHouse[c.cocHouseId] : null;
    const d = rec?.data;
    const L = c.local;
    const overrides = c.campusOverrides || {};

    let campuses: Campus[];
    if (d) {
      campuses = d.campuses.map((cp: any) => {
        const o = overrides[String(cp.id)] || {};
        const name = (o.name || cp.name).trim();
        return {
          id: cp.id,
          name,
          abbr: o.abbr !== undefined ? o.abbr || null : cleanAbbr(cp.nickname, name),
          primary: cp.primary,
          website: cp.website,
          anchor: slugify(name),
          fromApi: true,
          distance: cp.distance,
          info: {
            publicInstitution: typeof cp.publicInstitution === 'boolean' ? cp.publicInstitution : null,
            residency: cp.residency && cp.residency !== 'Unknown' ? cp.residency : null,
            undergrad: cp.undergrad || null,
            grad: cp.grad || null,
            levels: cp.programLevels || [],
            studentLife: (cp.studentLife || []).filter((x: any) => AMENITY_LABELS[x.name]).map((x: any) => AMENITY_LABELS[x.name]),
          },
          _raw: cp,
        } as Campus & { _raw: any };
      });
      for (const extra of c.extraCampuses || []) {
        campuses.push({ id: slugify(extra.name), name: extra.name, abbr: extra.abbr || null, primary: false, website: null, anchor: slugify(extra.name), fromApi: false });
      }
    } else {
      campuses = [
        { id: slugify(L.school), name: L.school, abbr: (c.aliases || [])[0] || null, primary: true, website: null, anchor: slugify(L.school), fromApi: false },
        ...(L.additionalCampuses || []).map((n: string) => ({ id: slugify(n), name: n, abbr: null, primary: false, website: null, anchor: slugify(n), fromApi: false })),
      ];
    }
    const primaryCampus = campuses.find((x) => x.primary) || campuses[0];
    const otherCampuses = campuses.filter((x) => x !== primaryCampus);

    // amenities from the primary campus (what the Chabad House and school offer)
    const amenityMap = new Map<string, Amenity>();
    const primaryRaw = (primaryCampus as any)._raw;
    for (const item of primaryRaw?.studentLife || []) {
      if (AMENITY_LABELS[item.name]) {
        amenityMap.set(item.name, {
          key: item.name,
          label: AMENITY_LABELS[item.name],
          byChabad: item.providers.includes('Chabad'),
          onCampus: item.providers.some((p: string) => p !== 'Chabad'),
        });
      }
    }
    // collapse overlapping kosher meal plans to the most generous one
    const mealTiers = ['Full Kosher meal plan (3 meals a day)', 'Daily Kosher meal plan (1 meal a day)', 'Limited Kosher meal plan (1 or 2 meals a week)'];
    const firstTier = mealTiers.find((t) => amenityMap.has(t));
    for (const t of mealTiers) if (t !== firstTier) amenityMap.delete(t);

    const staff: Staff[] = d
      ? d.staff.map((s: any) => ({ title: s.title, name: s.name, role: s.role, photo: isPlaceholderPhoto(s.photo) ? null : s.photoLocal || null, primary: s.primary }))
      : [];
    // group spouses together, rabbi first, directors' families first
    {
      const last = (x: Staff) => x.name.split(' ').slice(-1)[0];
      const rank = (x: Staff) => (/^director$/i.test(x.role || '') ? 0 : 1);
      const fam = new Map<string, number>();
      for (const x of staff) fam.set(last(x), Math.min(fam.get(last(x)) ?? 9, rank(x)));
      const famOrder = [...fam.keys()];
      staff.sort((a, b) =>
        (fam.get(last(a))! - fam.get(last(b))!) ||
        (famOrder.indexOf(last(a)) - famOrder.indexOf(last(b))) ||
        (Number(!/rabbi/i.test(a.title || '')) - Number(!/rabbi/i.test(b.title || ''))));
    }
    const hasApi = !!d;
    const officialName = (d?.name || L.name).replace(/\s*[—–]\s*/g, ', ');
    const shortName = L.name;

    const programList = programs
      .map((p) => {
        const { ids, all } = programCenterIds(p, allIds);
        return ids.includes(c.id) ? { program: p, confirmed: !all } : null;
      })
      .filter(Boolean) as { program: Program; confirmed: boolean }[];

    const ju = rosters.jewishu?.offeredAt.find((x) => x.center === c.id);
    const aliases: string[] = c.aliases || [];
    const directors = staff.length ? directorsLine(staff) : L.directors;
    const searchText = [
      officialName, shortName, ...campuses.map((x) => `${x.name} ${x.abbr || ''}`),
      d?.address?.city || L.city, directors, ...staff.map((s) => s.name), ...aliases,
    ].join(' ');

    return {
      id: c.id,
      slug: c.slug,
      url: `/campuses/${c.slug}/`,
      hasApi,
      officialName: officialName.trim(),
      shortName,
      primaryCampus,
      campuses,
      otherCampuses,
      city: d?.address?.city || L.city,
      region: REGION_OF[c.id] || 'south',
      regionName: REGIONS[REGION_OF[c.id] || 'south'].name,
      address: d?.address ? { street: d.address.street, city: d.address.city, state: d.address.state, zip: d.address.zip } : null,
      location: d?.location || L.location || null,
      phone: d?.phone || L.phone || null,
      email: d?.email || L.email || null,
      website: d?.website || L.website || null,
      donateUrl: d?.donateUrl || L.donateUrl || null,
      logo: d?.logoLocal || null,
      image: c.hideImage ? null : d?.imageLocal || null,
      staff,
      directorsLine: directors,
      social: d?.social || [],
      amenities: [...amenityMap.values()],
      programs: programList,
      jewishU: ju ? { courses: ju.courses || 0, currentCourses: ju.currentCourses || 0, locationUrl: `https://jewishu.org/locations/${ju.slug}` } : null,
      searchText,
      updatedAt: rec?.updatedAt || null,
      aliases,
      seoTitle: c.seoTitle || null,
    } satisfies Center;
  });
}

export const centers: Center[] = build();
export const centerById = Object.fromEntries(centers.map((c) => [c.id, c]));

export function centersByRegion() {
  return (Object.keys(REGIONS) as Region[]).map((r) => ({
    region: r,
    ...REGIONS[r],
    centers: centers.filter((c) => c.region === r),
  }));
}

/** Every college served, in directory order (each center's primary campus first). */
export function allColleges() {
  const rows: { campus: Campus; center: Center }[] = [];
  for (const center of centers) for (const campus of [center.primaryCampus, ...center.otherCampuses]) rows.push({ campus, center });
  return rows;
}

export function nearbyCenters(c: Center, n = 3): Center[] {
  const others = centers.filter((x) => x.id !== c.id);
  if (!c.location) return others.filter((x) => x.region === c.region).slice(0, n);
  const dist = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 3958.8 * 2 * Math.asin(Math.sqrt(h));
  };
  return others
    .map((o) => ({ o, d: o.location ? dist(c.location!, o.location) : o.region === c.region ? 150 : 9999 }))
    .sort((a, b) => a.d - b.d)
    .slice(0, n)
    .map((x) => x.o);
}

export const stats = {
  centers: centers.length,
  campuses: new Set(centers.flatMap((c) => c.campuses.map((x) => x.name))).size,
};

export function formatNumber(n: number) {
  return n.toLocaleString('en-US');
}

export function stateAbbr(state: string | null) {
  if (!state) return 'FL';
  return /^florida$/i.test(state) ? 'FL' : state;
}

/** "University of Florida" -> "the University of Florida" for use in sentences. */
export function withThe(name: string) {
  return /^(University|College)\b/.test(name) ? `the ${name}` : name;
}

const DISTANCE_TEXT: Record<string, string> = {
  FifthMile: 'right next to',
  QuarterMile: 'right next to',
  HalfMile: 'within half a mile of',
  Mile: 'about a mile from',
  OneMile: 'about a mile from',
  TwoMiles: 'about two miles from',
  FiveMiles: 'a short drive from',
  FivePlusMiles: 'a short drive from',
};
/** "right next to campus" / "about two miles from FSCJ" */
export function distanceText(d: string | null | undefined, place = 'campus') {
  return d && DISTANCE_TEXT[d] ? `${DISTANCE_TEXT[d]} ${place}` : null;
}
