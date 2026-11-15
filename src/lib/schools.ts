// One entry per individual school served by a Florida Chabad on Campus center.
// A school served by more than one center (e.g. University of Miami) gets one page
// listing every center. Built from the center data plus src/data/school-facts.ts.
import { allColleges, slugify, withThe, distanceText, type Center, type Campus } from './centers';
import { SCHOOL_FACTS, LOCALE_TEXT, type SchoolFacts } from '../data/school-facts';

export type YesRow = { key: string; icon: string; label: string; value: string; yes: boolean; note?: string; href?: string };
export type School = {
  slug: string;
  url: string;
  name: string;
  the: string;
  abbr: string | null;
  short: string;
  city: string;
  served: { center: Center; campus: Campus; primary: boolean; distance: string | null }[];
  facts: SchoolFacts | null;
  residency: string | null;
  studentLife: Set<string>;
  kosherWhere: 'campus' | 'chabad';
  glance: { group: string; rows: YesRow[] }[];
  onCampus: YesRow[];
  info: { icon: string; k: string; v: string; href?: string }[];
};

const canonical = (name: string) => name.replace(/\s*\(.*\)\s*$/, '').trim();
const pct = (n: number) => `${Math.round(n * 100)}%`;
const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

function build(): School[] {
  const map = new Map<string, School>();
  for (const { campus, center } of allColleges()) {
    const name = canonical(campus.name);
    const slug = slugify(name);
    let s = map.get(slug);
    if (!s) {
      const facts = SCHOOL_FACTS[slug] || null;
      s = {
        slug, url: `/colleges/${slug}/`, name, the: withThe(name), abbr: campus.abbr, short: campus.abbr || name,
        city: facts?.city || center.city, served: [], facts, residency: null, studentLife: new Set(), kosherWhere: 'chabad',
        glance: [], onCampus: [], info: [],
      };
      map.set(slug, s);
    }
    if (!s.abbr && campus.abbr) { s.abbr = campus.abbr; s.short = campus.abbr; }
    const raw = (campus as any)._raw;
    s.served.push({ center, campus, primary: campus === center.primaryCampus, distance: distanceText(campus.distance, s.abbr || 'campus') });
    if (raw) {
      if (!s.residency && raw.residency && raw.residency !== 'Unknown') s.residency = raw.residency;
      for (const item of raw.studentLife || []) {
        s.studentLife.add(item.name);
        if (/kosher/i.test(item.name) && !/passover/i.test(item.name) && (item.providers || []).includes('School')) s.kosherWhere = 'campus';
      }
    }
  }
  const schools = [...map.values()];
  for (const s of schools) finish(s);
  return schools;
}

function finish(s: School) {
  const cs = s.served.map((x) => x.center);
  const anyCenter = (pred: (c: Center) => boolean) => cs.some(pred);
  const hasProg = (slug: string) => anyCenter((c) => c.programs.some((p) => p.program.slug === slug && p.confirmed));
  const jewishU = anyCenter((c) => !!c.jewishU);
  const sl = s.studentLife;
  const has = (k: string) => sl.has(k);
  const yes = (key: string, icon: string, label: string, value = 'Yes', extra: Partial<YesRow> = {}): YesRow => ({ key, icon, label, value, yes: true, ...extra });
  const no = (key: string, icon: string, label: string, extra: Partial<YesRow> = {}): YesRow => ({ key, icon, label, value: 'No', yes: false, ...extra });
  const centerName = cs.length === 1 ? cs[0].officialName : 'Chabad';

  s.glance = [
    {
      group: 'Community',
      rows: [
        yes('served', 'BadgeCheck', 'Served by Chabad'),
        yes('rabbi', 'Users', 'Full-time Rabbi & Rebbetzin'),
        yes('shabbat', 'Flame', 'Shabbat dinners', 'Yes, every week'),
        yes('services', 'BookOpen', 'Religious services'),
      ],
    },
    {
      group: 'Kosher food',
      rows: [
        yes('kosher', 'UtensilsCrossed', 'Kosher food available', s.kosherWhere === 'campus' ? 'Yes, on campus & at Chabad' : 'Yes, at Chabad'),
        ...(has('Full Kosher meal plan (3 meals a day)') || has('Daily Kosher meal plan (1 meal a day)') || has('Limited Kosher meal plan (1 or 2 meals a week)')
          ? [yes('mealplan', 'ChefHat', 'Kosher meal plan', has('Full Kosher meal plan (3 meals a day)') ? 'Yes, 3 meals a day' : has('Daily Kosher meal plan (1 meal a day)') ? 'Yes, daily' : 'Yes, weekly')]
          : []),
        yes('passover', 'Wine', 'Kosher for Passover meals'),
      ],
    },
    {
      group: 'Learning',
      rows: [
        jewishU ? yes('jewishu', 'GraduationCap', 'JewishU courses offered', 'Yes', { href: '/programs/jewishu/' }) : no('jewishu', 'GraduationCap', 'JewishU courses offered', { href: '/programs/jewishu/' }),
        hasProg('sinai-scholars') ? yes('sinai', 'ScrollText', 'Sinai Scholars Society', 'Yes', { href: '/programs/sinai-scholars/' }) : no('sinai', 'ScrollText', 'Sinai Scholars Society', { href: '/programs/sinai-scholars/' }),
      ],
    },
    {
      group: 'Israel & travel',
      rows: [
        yes('birthright', 'Plane', 'Birthright Israel participation', 'Yes', { href: '/programs/birthright-israel/' }),
        hasProg('your-israel') ? yes('yourisrael', 'Globe', 'Your Israel course', 'Yes', { href: '/programs/your-israel/' }) : null,
        yes('pegisha', 'Sun', 'Florida Pegisha Shabbaton', 'Yes', { href: '/programs/florida-pegisha/' }),
        yes('intlpegisha', 'Flame', 'International Pegisha', 'Yes', { href: '/programs/pegisha/' }),
        yes('livinglinks', 'Landmark', 'Living Links trip', 'Yes', { href: '/programs/living-links/' }),
      ].filter(Boolean) as YesRow[],
    },
    {
      group: 'Care & home',
      rows: [
        yes('mezuzah', 'DoorOpen', 'Mezuzah loans', 'Yes', { href: '/programs/mezuzah-loans/' }),
        yes('soup', 'Soup', 'Chicken soup when you are sick', 'Yes', { href: '/programs/soup-delivery/' }),
        has('Jewish student lounge') ? yes('lounge', 'Sofa', 'Jewish student lounge') : null,
        has('Jewish student housing') ? yes('housing', 'BedDouble', 'Jewish student housing') : null,
        has('Daily minyan') ? yes('minyan', 'Sunrise', 'Daily minyan') : null,
      ].filter(Boolean) as YesRow[],
    },
  ];

  // Jewish life on campus beyond Chabad
  const f = s.facts;
  s.onCampus = [
    f?.jewishStudies ? yes('jstudies', 'Library', 'Jewish Studies offered', f.jewishStudies.label, { href: f.jewishStudies.url }) : null,
    has('Jewish Greek life') ? yes('greek', 'Users', 'Jewish Greek life') : null,
    has('Israel Orgs') ? yes('israelorgs', 'Globe', 'Israel student groups') : null,
    has('Other Jewish student groups') ? yes('groups', 'Users', 'Other Jewish student groups') : null,
    has('Kosher restaurant') ? yes('kdining', 'ChefHat', 'Kosher dining') : null,
    has('Packaged kosher food') ? yes('kpack', 'Package', 'Packaged kosher food') : null,
    has('Kosher food truck') ? yes('ktruck', 'Truck', 'Kosher food truck') : null,
  ].filter(Boolean) as YesRow[];

  const levels = f ? (f.highestDegree === 'Graduate' ? "Bachelor's & graduate" : f.highestDegree === 'Bachelor' ? "Associate & bachelor's" : 'Associate') : null;
  const dist = s.served.find((x) => x.distance)?.distance;
  s.info = [
    f && { icon: 'Landmark', k: 'Type', v: f.ownership },
    { icon: 'MapPin', k: 'Location', v: `${s.city}, Florida` },
    f?.locale && { icon: 'Building2', k: 'Setting', v: LOCALE_TEXT[f.locale] },
    s.residency && { icon: 'House', k: 'Commuter or residential', v: s.residency },
    levels && { icon: 'GraduationCap', k: 'Degrees', v: levels },
    f?.students && !f.systemWide && { icon: 'Users', k: 'Undergraduates', v: f.students.toLocaleString('en-US') },
    f?.gradStudents && { icon: 'Users', k: 'Graduate students', v: f.gradStudents.toLocaleString('en-US') },
    f && f.admitRate !== undefined && { icon: 'DoorOpen', k: 'Acceptance rate', v: f.admitRate === null ? 'Open admission' : pct(f.admitRate) },
    f?.tuitionIn && (f.tuitionIn === f.tuitionOut
      ? { icon: 'Wallet', k: 'Tuition', v: usd(f.tuitionIn) }
      : { icon: 'Wallet', k: 'Tuition, in-state', v: usd(f.tuitionIn) }),
    f?.tuitionOut && f.tuitionOut !== f.tuitionIn && { icon: 'Wallet', k: 'Tuition, out-of-state', v: usd(f.tuitionOut) },
    f?.netPrice && { icon: 'Receipt', k: 'Average net price', v: usd(f.netPrice) },
    f?.ratio && { icon: 'Presentation', k: 'Student to faculty', v: `${f.ratio} to 1` },
    f?.retention && { icon: 'RefreshCw', k: 'Freshman retention', v: pct(f.retention) },
    f?.gradRate && { icon: 'Award', k: 'Graduation rate', v: pct(f.gradRate) },
    f?.earnings && { icon: 'TrendingUp', k: 'Median earnings, 10 years', v: usd(f.earnings) },
    dist && { icon: 'Navigation', k: 'Chabad House', v: dist.charAt(0).toUpperCase() + dist.slice(1) },
  ].filter(Boolean) as School['info'];
  void centerName;
}

export const schools: School[] = build();
export const schoolBySlug = Object.fromEntries(schools.map((s) => [s.slug, s]));
/** School page for a campus name, if one exists. */
export function schoolUrlFor(campusName: string) {
  return schoolBySlug[slugify(canonical(campusName))]?.url || null;
}
