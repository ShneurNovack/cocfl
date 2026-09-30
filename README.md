# Chabad on Campus Florida

The statewide site for Chabad on Campus in Florida: [chabadoncampusfl.org](https://chabadoncampusfl.org).

Built with [Astro](https://astro.build) as a fully static, server-rendered site. Every page, including the directory and all center pages, ships complete HTML, so search engines never see an empty shell. It deploys to Cloudflare Pages automatically from `main`.

## How the directory works

```
data/centers.json          the authoritative list of Florida centers (edit this)
data/coc/<houseId>.json    synced Chabad on Campus API data, one file per center
data/coc-programs.json     synced program rosters (JewishU, Sinai Scholars, Your Israel)
data/sync-log.json         log of every sync run that changed data or hit an error
public/media/coc/          center logos, photos and staff photos, mirrored and resized to WebP
scripts/sync.mjs           the daily sync
.github/workflows/sync-directory.yml   runs the sync every day at 5:17am Eastern
```

1. **`data/centers.json` decides who is in the directory.** Each center has a local `id`, a URL `slug` (`/campuses/<slug>/`), its permanent Chabad on Campus `cocHouseId`, search aliases, and a `local` block used as a fallback. A center with `"cocHouseId": null` (currently Miami Dade College) is kept and rendered from its local data only.
2. **The daily sync** (`npm run sync`) requests each saved house ID directly from `https://api.chabadoncampus.org/api/1.0/ChabadHouses/Public/<id>`, pulls every linked campus from `Campuses/Public/<id>`, map coordinates from `ChabadHouses/public`, and program rosters from `EduChabadHouses/public`. It normalizes the data, downloads and resizes images, and rewrites a center's file **only when the normalized data actually changed**.
3. **Failures never erase data.** A timeout, error status, malformed JSON or a response that fails validation (wrong ID, missing name or campuses) leaves that center's stored file untouched. Failed images keep the previous local copy. The job commits whatever did update, then fails so GitHub emails a notification. Details are in the Action log and `data/sync-log.json`.
4. **A commit to `main` triggers a Cloudflare Pages build**, so the live site always reflects the stored data and never calls the API when someone loads a page.

Run it by hand from the Actions tab (**Sync directory from Chabad on Campus API > Run workflow**) or locally with `npm run sync`. `npm run check-data` fetches and compares without writing.

### Adding a center

1. Find its Chabad House ID: search `https://api.chabadoncampus.org/api/1.0/Search/public` (POST, `{"text":"<school>","attributes":[],"regions":[],"topInJewishPopulation":0,"radiusDistance":"10","zip":""}`) and read `chabadHouseID`, then confirm it with `ChabadHouses/Public/<id>`.
2. Add an entry to `data/centers.json` with a new `id`, `slug`, `cocHouseId`, `aliases` and a `local` block.
3. Run the sync workflow. The center page, directory card, sitemap entry and program listings appear on the next build.

### Program "Offered At" lists

`src/data/programs.ts` holds program content. `offeredAt` is either `api:<slug>` (synced daily), `'all'` (network-wide, every center) or a hand-kept list of center IDs.

- JewishU uses `eduProgramId=1`, which is verified as the exact list behind jewishu.org/locations.
- Your Israel (`2`) and Sinai Scholars (`3`) are inferred: the public API has no program-name lookup, but every Florida center confirmed on its own site to run those programs appears in the matching list. If a list ever looks wrong, remove that entry from `PROGRAMS` in `scripts/sync.mjs` and set a hand-kept list in `programs.ts`.
- Birthright is a hand-kept list of centers known to lead their own groups.

## Site structure

| Path | Purpose |
| --- | --- |
| `/` | Home: hero search, stats, directory by region, programs, testimonials |
| `/campuses/` | Searchable directory (fuzzy search, abbreviations, region filters) plus an A to Z table of every college |
| `/campuses/<slug>/` | One page per center, with contact info, directors, amenities, programs, campuses served and Q&A |
| `/programs/` and `/programs/<slug>/` | JewishU, Sinai Scholars, Birthright & Israel, Pegisha, Your Israel, Living Links, Study Away Grant |
| `/jewish-life-on-campus/...` | Guides: overview, Florida, Shabbat, holidays, kosher food, choosing a college, resources |
| `/parents/`, `/about/`, `/faq/` | Parents, organization and FAQ (the only page with FAQPage schema) |

Technical SEO: unique titles and descriptions, canonical URLs, Open Graph and Twitter tags, JSON-LD (Organization, WebSite, BreadcrumbList, center Organization with address, geo, staff and campuses served, ItemList, Article, FAQPage), `sitemap-index.xml`, `robots.txt`, 301 redirects from the old `/directory` URLs (`public/_redirects`) and long-lived caching headers (`public/_headers`).

## Development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs dist/
```

Organization-reported figures (students served, engagements) and testimonials live in `src/lib/site.ts`. Program copy lives in `src/data/programs.ts`. Guide pages are in `src/pages/jewish-life-on-campus/`.

Cloudflare Pages settings: build command `npm run build`, output directory `dist`, Node 22.
