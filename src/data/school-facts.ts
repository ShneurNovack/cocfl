// Public facts about each Florida school served by a Chabad on Campus center.
// Source: U.S. Department of Education College Scorecard (collegescorecard.ed.gov),
// pulled Nov 2026. Jewish Studies entries were checked against each school's own site.
// Keyed by the school page slug (slugified school name). No Jewish population figures.
export type SchoolFacts = {
  ipeds?: number;
  city: string;
  ownership: 'Public' | 'Private';
  locale?: 11 | 12 | 21 | 22;
  highestDegree: 'Associate' | 'Bachelor' | 'Graduate';
  students?: number; // undergraduates (Scorecard "size")
  gradStudents?: number;
  totalStudents?: number; // from the school's own latest count, when newer than Scorecard
  enrollTerm?: string; // e.g. 'fall 2026', set when enrollment comes from the school itself
  enrollSource?: string;
  admitRate?: number | null; // null = open admission
  tuitionIn?: number;
  tuitionOut?: number;
  netPrice?: number;
  ratio?: number;
  gradRate?: number;
  retention?: number;
  earnings?: number;
  website?: string;
  formerly?: string;
  systemWide?: boolean; // figures reported for the whole multi-campus system
  jewishStudies?: { label: string; url: string };
};

export const SCHOOL_FACTS: Record<string, SchoolFacts> = {
  'university-of-florida': { ipeds: 134130, city: 'Gainesville', ownership: 'Public', locale: 12, highestDegree: 'Graduate', students: 35629, gradStudents: 19738, admitRate: 0.242, tuitionIn: 6381, tuitionOut: 30886, netPrice: 5969, ratio: 16, gradRate: 0.9211, retention: 0.9771, earnings: 78456, website: 'https://www.ufl.edu/', jewishStudies: { label: 'Jewish Studies major and minor', url: 'https://catalog.ufl.edu/UGRD/colleges-schools/UGLAS/JST_BA/' } },
  'santa-fe-college': { ipeds: 137096, city: 'Gainesville', ownership: 'Public', locale: 22, highestDegree: 'Bachelor', students: 11122, admitRate: null, tuitionIn: 2563, tuitionOut: 9189, netPrice: 11289, ratio: 18, gradRate: 0.5289, earnings: 46650, website: 'https://www.sfcollege.edu/' },
  'florida-state-university': { ipeds: 134097, city: 'Tallahassee', ownership: 'Public', locale: 12, highestDegree: 'Graduate', students: 32212, gradStudents: 11169, admitRate: 0.2422, tuitionIn: 5656, tuitionOut: 20116, netPrice: 8605, ratio: 17, gradRate: 0.8581, retention: 0.9605, earnings: 68225, website: 'https://www.fsu.edu/', jewishStudies: { label: 'Jewish Studies minor', url: 'https://religion.fsu.edu/node/131' } },
  'tallahassee-state-college': { ipeds: 137759, city: 'Tallahassee', ownership: 'Public', locale: 12, highestDegree: 'Bachelor', students: 11053, admitRate: null, tuitionIn: 2622, tuitionOut: 10069, netPrice: 7008, ratio: 25, gradRate: 0.3805, earnings: 43089, website: 'https://www.tsc.fl.edu/', formerly: 'Tallahassee Community College' },
  'florida-a-and-m-university': { ipeds: 133650, city: 'Tallahassee', ownership: 'Public', locale: 12, highestDegree: 'Graduate', students: 7582, gradStudents: 1423, admitRate: 0.2056, tuitionIn: 5785, tuitionOut: 17734, netPrice: 15220, ratio: 14, gradRate: 0.6148, retention: 0.8918, earnings: 52104, website: 'https://www.famu.edu/' },
  'keiser-university': { ipeds: 13508102, city: 'Tallahassee', ownership: 'Private', highestDegree: 'Graduate', tuitionIn: 26016, tuitionOut: 26016, website: 'https://www.keiseruniversity.edu/tallahassee/' },
  'university-of-central-florida': { ipeds: 132903, city: 'Orlando', ownership: 'Public', locale: 21, highestDegree: 'Graduate', students: 59146, gradStudents: 10161, admitRate: 0.4011, tuitionIn: 6368, tuitionOut: 24076, netPrice: 11516, ratio: 28, gradRate: 0.7785, retention: 0.9235, earnings: 63483, website: 'https://www.ucf.edu/', jewishStudies: { label: 'Judaic Studies minor', url: 'https://www.ucf.edu/degree/judaic-studies-minor/' } },
  'valencia-college': { ipeds: 138187, city: 'Orlando', ownership: 'Public', locale: 11, highestDegree: 'Bachelor', students: 39486, admitRate: null, tuitionIn: 2664, tuitionOut: 9576, netPrice: 9264, ratio: 27, gradRate: 0.4951, earnings: 45388, website: 'https://valenciacollege.edu/' },
  'university-of-north-florida': { ipeds: 136172, city: 'Jacksonville', ownership: 'Public', locale: 11, highestDegree: 'Graduate', totalStudents: 18900, gradStudents: 2831, enrollTerm: 'fall 2026', enrollSource: 'https://www.unf.edu/newsroom/2026/09/Class-of-2030.html', admitRate: 0.5324, tuitionIn: 6389, tuitionOut: 20793, netPrice: 11689, ratio: 19, gradRate: 0.6851, retention: 0.8466, earnings: 59626, website: 'https://www.unf.edu/', jewishStudies: { label: 'Jewish Studies minor', url: 'https://www.unf.edu/coas/religious-studies/Jewish-Studies-Minor.html' } },
  'florida-state-college-at-jacksonville': { ipeds: 133702, city: 'Jacksonville', ownership: 'Public', locale: 11, highestDegree: 'Bachelor', students: 19648, admitRate: null, tuitionIn: 2878, tuitionOut: 9992, netPrice: 8717, ratio: 27, gradRate: 0.383, earnings: 45388, website: 'https://www.fscj.edu/' },
  'jacksonville-university': { ipeds: 134945, city: 'Jacksonville', ownership: 'Private', locale: 11, highestDegree: 'Graduate', students: 2930, gradStudents: 1301, admitRate: 0.5694, tuitionIn: 49800, tuitionOut: 49800, netPrice: 28424, ratio: 11, gradRate: 0.4891, retention: 0.7467, earnings: 77598, website: 'https://www.ju.edu/' },
  'university-of-south-florida': { ipeds: 137351, city: 'Tampa', ownership: 'Public', locale: 11, highestDegree: 'Graduate', students: 37207, gradStudents: 11097, admitRate: 0.4319, tuitionIn: 6410, tuitionOut: 18416, netPrice: 8648, ratio: 22, gradRate: 0.7791, retention: 0.9128, earnings: 63660, website: 'https://www.usf.edu/' },
  'university-of-tampa': { ipeds: 137847, city: 'Tampa', ownership: 'Private', locale: 11, highestDegree: 'Graduate', students: 10572, gradStudents: 835, admitRate: 0.4034, tuitionIn: 35744, tuitionOut: 35744, netPrice: 40584, ratio: 17, gradRate: 0.6942, retention: 0.8545, earnings: 69272, website: 'https://www.ut.edu/' },
  'university-of-miami': { ipeds: 135726, city: 'Coral Gables', ownership: 'Private', locale: 21, highestDegree: 'Graduate', students: 12913, gradStudents: 6602, admitRate: 0.189, tuitionIn: 65430, tuitionOut: 65430, netPrice: 36483, ratio: 11, gradRate: 0.8358, retention: 0.9377, earnings: 84093, website: 'https://www.miami.edu/', jewishStudies: { label: 'Judaic Studies major and minor', url: 'https://bulletin.miami.edu/undergraduate-academic-programs/arts-sciences/judaic-studies/george-feldenkreis-program-judaic-studies-minor/' } },
  'florida-international-university': { ipeds: 133951, city: 'Miami', ownership: 'Public', locale: 21, highestDegree: 'Graduate', students: 39508, gradStudents: 9530, admitRate: 0.5466, tuitionIn: 6565, tuitionOut: 20204, netPrice: 11462, ratio: 24, gradRate: 0.7762, retention: 0.9185, earnings: 65722, website: 'https://www.fiu.edu/', jewishStudies: { label: 'Jewish Studies certificate', url: 'https://jewishstudies.fiu.edu/courses-certificate-programs/' } },
  'florida-atlantic-university': { ipeds: 133669, city: 'Boca Raton', ownership: 'Public', locale: 12, highestDegree: 'Graduate', students: 23757, gradStudents: 6731, admitRate: 0.6613, tuitionIn: 4879, tuitionOut: 17324, netPrice: 10394, ratio: 24, gradRate: 0.6436, retention: 0.8447, earnings: 61062, website: 'https://www.fau.edu/', jewishStudies: { label: 'Jewish Studies major and minor', url: 'https://www.fau.edu/artsandletters/jewishstudies/programs/index.php' } },
  'lynn-university': { ipeds: 132657, city: 'Boca Raton', ownership: 'Private', locale: 12, highestDegree: 'Graduate', students: 2859, gradStudents: 653, admitRate: 0.7347, tuitionIn: 46450, tuitionOut: 46450, netPrice: 43806, ratio: 16, gradRate: 0.5738, retention: 0.766, earnings: 58891, website: 'https://www.lynn.edu/' },
  'palm-beach-state-college': { ipeds: 136358, city: 'Lake Worth', ownership: 'Public', locale: 21, highestDegree: 'Bachelor', students: 21956, admitRate: null, tuitionIn: 3050, tuitionOut: 10910, netPrice: 8820, ratio: 31, gradRate: 0.4216, earnings: 46814, website: 'https://www.pbsc.edu/' },
  'nova-southeastern-university': { ipeds: 136215, city: 'Fort Lauderdale', ownership: 'Private', locale: 21, highestDegree: 'Graduate', students: 7240, gradStudents: 13599, admitRate: 0.7321, tuitionIn: 40360, tuitionOut: 40360, netPrice: 27714, ratio: 16, gradRate: 0.6179, retention: 0.7564, earnings: 66144, website: 'https://www.nova.edu/' },
  'broward-college': { ipeds: 132709, city: 'Fort Lauderdale', ownership: 'Public', locale: 12, highestDegree: 'Bachelor', students: 24922, admitRate: null, tuitionIn: 2830, tuitionOut: 8952, netPrice: 7989, ratio: 31, gradRate: 0.3992, earnings: 45986, website: 'https://www.broward.edu/' },
  'florida-gulf-coast-university': { ipeds: 433660, city: 'Fort Myers', ownership: 'Public', locale: 21, highestDegree: 'Graduate', students: 13874, gradStudents: 2149, admitRate: 0.6344, tuitionIn: 6118, tuitionOut: 25162, netPrice: 11555, ratio: 20, gradRate: 0.5691, retention: 0.8322, earnings: 59401, website: 'https://www.fgcu.edu/' },
  'florida-southwestern-state-college': { ipeds: 133508, city: 'Fort Myers', ownership: 'Public', locale: 21, highestDegree: 'Bachelor', students: 11052, admitRate: null, tuitionIn: 3401, tuitionOut: 12979, netPrice: 4782, ratio: 27, gradRate: 0.3437, earnings: 48404, website: 'https://www.fsw.edu/' },
  'miami-dade-college': { ipeds: 135717, city: 'Miami', ownership: 'Public', locale: 11, highestDegree: 'Bachelor', students: 46182, admitRate: null, tuitionIn: 2838, tuitionOut: 9661, netPrice: 3814, ratio: 22, gradRate: 0.4675, earnings: 45444, website: 'https://www.mdc.edu/' },
  'rollins-college': { ipeds: 136950, city: 'Winter Park', ownership: 'Private', locale: 21, highestDegree: 'Graduate', students: 2631, gradStudents: 406, admitRate: 0.4754, tuitionIn: 62950, tuitionOut: 62950, netPrice: 36204, ratio: 12, gradRate: 0.7776, retention: 0.8524, earnings: 64156, website: 'https://www.rollins.edu/', jewishStudies: { label: 'Jewish Studies minor', url: 'https://www.rollins.edu/jewish-studies/' } },
};

export const LOCALE_TEXT: Record<number, string> = { 11: 'Large city', 12: 'Midsize city', 21: 'Large suburb', 22: 'Midsize suburb' };
