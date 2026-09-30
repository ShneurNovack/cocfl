// Program content for /programs/*. Facts come from ChabadOnCampus.org, JewishU.org,
// SinaiScholars.com and Florida center websites (researched Sept 2026).
//
// offeredAt:
//   'api:<slug>'   -> list comes from the daily Chabad on Campus sync (data/coc-programs.json)
//   'all'          -> network-wide opportunity; every Florida center is a point of entry
//   [center ids]   -> maintained by hand here; edit when a center starts or stops a program

export type Faq = { q: string; a: string };
export type Section = { h2: string; body: string[]; list?: string[] };

export type Program = {
  slug: string;
  name: string;
  shortName: string;
  category: 'Learning' | 'Shabbatons' | 'Travel & Israel' | 'Care & Home';
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  logo?: string;
  image: string; // key in /public/images, without size suffix
  imageAlt: string;
  audience: string;
  format: string;
  cost: string;
  intro: string[];
  sections: Section[];
  faqs: Faq[];
  offeredAt: `api:${string}` | 'all' | string[];
  offeredAtNote: string;
  /** Has its own hand-designed page instead of the shared program template. */
  custom?: boolean;
  officialLinks: { label: string; href: string }[];
  related: string[];
};

export const programs: Program[] = [
  {
    slug: 'florida-pegisha',
    name: 'Florida Pegisha',
    shortName: 'Florida Pegisha',
    category: 'Shabbatons',
    custom: true,
    tagline: 'An unforgettable Shabbat weekend with Jewish students from every campus across Florida.',
    metaTitle: 'Florida Pegisha: Statewide Shabbaton for Jewish College Students',
    metaDescription:
      'Florida Pegisha brings Jewish college students from campuses across Florida together for one unforgettable Shabbat weekend of great food, lively services, workshops, music and a Mega Havdalah.',
    logo: '/images/logo-pegisha.webp',
    image: 'fp-group',
    imageAlt: 'Florida college students in matching Florida Pegisha shirts at the statewide Shabbaton',
    audience: 'Jewish students at any Florida college, from every background.',
    format: 'A statewide Shabbat weekend, Friday through Saturday night.',
    cost: 'Heavily subsidized. Your Chabad House will share the price for your campus.',
    intro: [],
    sections: [],
    faqs: [
      { q: 'What is Florida Pegisha?', a: 'Florida Pegisha is a statewide Shabbat weekend for Jewish college students. Students from Chabad on Campus centers all across Florida come together for great food, lively services, engaging workshops, new friends and a Mega Havdalah to close it out.' },
      { q: 'Where is Florida Pegisha taking place?', a: 'The location changes from year to year and is announced together with the dates. Your campus Chabad House will have all the details.' },
      { q: 'How can I register for Florida Pegisha?', a: 'Registration for this year is not open yet. Reach out to your campus Chabad House and they will let you know as soon as it opens. Most students travel together with their campus group.' },
      { q: 'Is there a registration fee?', a: 'Yes, but the weekend is heavily subsidized so every student can come. Your Chabad House will tell you the price for your campus.' },
      { q: 'Are meals provided during the event?', a: 'Yes. All Shabbat meals are provided, from Friday night dinner through the third Shabbat meal, along with plenty of snacks in between.' },
      { q: 'What should I pack?', a: 'Nice clothes for Friday night and Shabbat day, something comfortable for Saturday night, and your toiletries. Your welcome bag and Florida Pegisha shirt are on us.' },
      { q: 'Do I need to know anything about Shabbat?', a: 'Not at all. Many students experience their first full Shabbat at Florida Pegisha. Everything is explained along the way, and every background is welcome.' },
      { q: 'Can I come if I do not know anyone going?', a: 'Absolutely. You will travel with your campus group, and the whole weekend is built around meeting new people.' },
    ],
    offeredAt: 'all',
    offeredAtNote: 'Students at every Florida Chabad on Campus center can join the Florida Pegisha through their own Chabad House.',
    officialLinks: [],
    related: ['pegisha', 'jewishu', 'birthright-israel'],
  },
  {
    slug: 'jewishu',
    name: 'JewishU',
    shortName: 'JewishU',
    category: 'Learning',
    tagline: 'Bite-size Jewish courses on campus, with real rewards for learning.',
    metaTitle: 'JewishU: Jewish Courses for College Students in Florida',
    metaDescription:
      'JewishU offers short, engaging Jewish courses for college students through Chabad on Campus, with credits and rewards. See which Florida campuses offer JewishU.',
    logo: '/images/logo-jewishu.webp',
    image: 'fl-jewishu',
    imageAlt: 'FSU students sitting in a circle during a class at the Chabad House',
    audience: 'Undergraduate and graduate students of every background. No prior knowledge or Hebrew needed.',
    format: 'Short in-person courses run by your campus Chabad House, tracked on the JewishU platform.',
    cost: 'Free for students. Many courses come with incentives for completing them.',
    intro: [
      'JewishU is the Chabad on Campus learning platform built for the way college students actually live: short courses, flexible schedules and a structured path that rewards you for showing up and growing.',
      'Courses are taught in person by the rabbi and rebbetzin at your campus Chabad House, usually over food, and cover everything from Jewish ethics and relationships to Shabbat, holidays, Israel and the big questions students ask. Each course you finish earns credits on the JewishU platform, and the platform keeps track of your progress from semester to semester.',
    ],
    sections: [
      {
        h2: 'What a JewishU course looks like',
        body: [
          'Most JewishU courses run for a handful of sessions during the semester. A typical class is relaxed and discussion based: a short text or idea, a lot of conversation, and plenty of room for questions. You do not need to know Hebrew, be observant, or have gone to Hebrew school.',
          'Because every course lives on one platform, you can see what is being offered at your campus this semester, sign up, and track your completed courses in one place.',
        ],
      },
      {
        h2: 'Credits, incentives and JewishU Travel',
        body: [
          'JewishU is designed to make Jewish learning feel as valuable as anything else on your calendar. Students earn credits for completed courses, and many Chabad Houses pair courses with incentives. JewishU also runs JewishU Travel, heritage and learning trips abroad for students who have been learning through the platform. Recent JewishU Travel itineraries offered through Florida Chabad Houses have included Spain and Gibraltar, Panama and Thailand.',
        ],
      },
      {
        h2: 'Who JewishU is for',
        body: [
          'JewishU is for any Jewish college student who is curious. Some students take one course to see what it is like. Others take a course every semester and build a real foundation in Jewish thought and practice by graduation. It is a natural next step for students who come to Shabbat dinner and want to go a little deeper.',
        ],
      },
    ],
    faqs: [
      { q: 'Do I need a Jewish education to take a JewishU course?', a: 'No. JewishU courses are designed for students of every background. Everything is explained from the ground up, and questions are welcome.' },
      { q: 'Does JewishU cost anything?', a: 'JewishU courses are free for students. Your local Chabad House runs the course and often provides food and incentives for completing it.' },
      { q: 'How do I sign up for JewishU in Florida?', a: 'Find your school in the Chabad on Campus Florida directory and reach out to your campus Chabad House, or look up your campus on JewishU.org to see current courses.' },
      { q: 'Can I take JewishU courses at more than one school?', a: 'Your JewishU record lives on one platform, so the courses you complete stay with you if you transfer or take a course at a different Chabad House.' },
    ],
    offeredAt: 'api:jewishu',
    offeredAtNote: 'Florida centers on the JewishU platform, updated daily from Chabad on Campus.',
    officialLinks: [
      { label: 'JewishU.org', href: 'https://jewishu.org/' },
      { label: 'Find a JewishU location', href: 'https://jewishu.org/locations' },
    ],
    related: ['sinai-scholars', 'your-israel', 'florida-pegisha'],
  },
  {
    slug: 'sinai-scholars',
    name: 'Sinai Scholars Society',
    shortName: 'Sinai Scholars',
    category: 'Learning',
    tagline: 'A selective Jewish learning fellowship for motivated college students.',
    metaTitle: 'Sinai Scholars Society at Florida Colleges | Chabad on Campus',
    metaDescription:
      'Sinai Scholars Society is an eight-week Jewish learning fellowship for college students with a stipend, a national retreat and lifelong community. Find it in Florida.',
    logo: '/images/logo-sinai-scholars.webp',
    image: 'fl-sinai',
    imageAlt: 'Chabad at NSU students holding their books at a Sinai Scholars celebration',
    audience: 'Motivated undergraduates and graduate students who want a serious, structured Jewish learning experience.',
    format: 'Eight two-hour classes over a semester, plus a Shabbat experience, a class retreat and a closing event.',
    cost: 'Free to join. Students who complete all requirements receive a stipend.',
    intro: [
      'Sinai Scholars Society is a joint project of Chabad on Campus and the Rohr Jewish Learning Institute. It brings a small, selective group of students together for an eight-week course in Jewish thought, taught at their campus Chabad House, and then connects them to a national community of Sinai Scholars.',
      'Students often describe it as the most meaningful class they took in college. The coursework is real, the discussions are honest, and the relationships built with classmates and instructors tend to last well beyond graduation.',
    ],
    sections: [
      {
        h2: 'What you study',
        body: [
          'The core Sinai Scholars curriculum examines Jewish thought, literature and practice from a modern perspective. Depending on the semester and campus, courses have included introductions to Jewish wisdom for modern life, practical explorations of Jewish law through real cases, the spiritual meaning of Israel, Kabbalah and the Tanya, and the life teachings of the Lubavitcher Rebbe.',
        ],
      },
      {
        h2: 'Requirements and the stipend',
        body: [
          'Sinai Scholars asks more of students than a typical club, and it rewards them for it. Students who complete the program receive a stipend. To earn it, fellows generally:',
        ],
        list: [
          'Attend all eight two-hour classes',
          'Take part in at least three events, including a Shabbat experience, a class retreat and a closing gala',
          'Write a one-page reflection on how the course shaped their perspective',
          'Write a research paper of at least five pages on a topic from the course',
        ],
      },
      {
        h2: 'Beyond the classroom: the retreat and the symposium',
        body: [
          'Fellows can apply to the Sinai Scholars National Jewish Retreat, a multi-day gathering of students from campuses across the country with leading Jewish thinkers and educators, offered with a significant scholarship. Students who want to take their research further can join the Mentor-Protege Program, write an original paper with a professor or scholar as mentor, and compete to present at the Sinai Scholars Academic Symposium.',
        ],
      },
      {
        h2: 'How to apply',
        body: [
          'Spaces are limited, so each Chabad House selects the students who are most interested in completing the program. Observance level and background do not matter. After you apply, you will meet with the course instructor, and accepted students attend a short orientation before classes begin.',
        ],
      },
    ],
    faqs: [
      { q: 'Is Sinai Scholars only for observant or knowledgeable students?', a: 'No. Acceptance is based on interest and motivation, not on how much you already know or how observant you are.' },
      { q: 'How much does Sinai Scholars cost?', a: 'Nothing. It is free to join, and students who finish all of the requirements receive a stipend.' },
      { q: 'When does Sinai Scholars run?', a: 'Each Chabad House schedules its own cohort, usually during the fall or spring semester. Contact your campus Chabad House for the next start date.' },
      { q: 'Who runs Sinai Scholars?', a: 'Sinai Scholars Society is a joint project of Chabad on Campus and the Rohr Jewish Learning Institute, taught locally by your campus Chabad House.' },
    ],
    offeredAt: 'api:sinai-scholars',
    offeredAtNote: 'Florida centers enrolled in Sinai Scholars Society, updated daily from Chabad on Campus. Ask your Chabad House about the next cohort.',
    officialLinks: [{ label: 'SinaiScholars.com', href: 'https://www.sinaischolars.com/' }],
    related: ['jewishu', 'your-israel', 'pegisha'],
  },
  {
    slug: 'birthright-israel',
    name: 'Birthright Israel & Israel Experiences',
    shortName: 'Birthright & Israel',
    category: 'Travel & Israel',
    tagline: 'A free trip to Israel with your campus Chabad, and ways to go back and go deeper.',
    metaTitle: 'Birthright Israel with Chabad for Florida College Students',
    metaDescription:
      'Go to Israel on Birthright with your Florida Chabad House, plus study programs and heritage trips for going back. Eligibility, what to expect and FAQs.',
    image: 'fl-israel',
    imageAlt: 'Chabad at UCF students riding camels on a trip in Israel',
    audience: 'Jewish young adults, generally ages 18 to 26, who meet Birthright Israel eligibility requirements.',
    format: 'A ten-day group trip to Israel, usually during winter or summer break, led by your Chabad House staff.',
    cost: 'Birthright trips are a gift: the trip itself is free for eligible participants. A refundable deposit is typically required.',
    intro: [
      'For many Jewish students, the first trip to Israel changes everything. Chabad on Campus runs Birthright Israel trips through Mayanot, one of the largest Birthright trip organizers, and many Florida Chabad Houses bring their own student groups each winter and summer.',
      'Traveling with your campus Chabad means you go with friends from your school and come home with a community that keeps the experience going: Shabbat dinners, classes and the people you shared the trip with.',
    ],
    sections: [
      {
        h2: 'What a Chabad Birthright trip is like',
        body: [
          'Birthright is a ten-day tour of Israel for Jewish young adults. Groups typically visit Jerusalem and the Western Wall, hike in the north, float in the Dead Sea, climb Masada, spend Shabbat together and meet Israelis their own age. Chabad groups add warmth and depth: your own rabbi and rebbetzin or campus staff often travel with the group, and the conversations continue long after you land.',
        ],
      },
      {
        h2: 'Eligibility',
        body: [
          'Birthright Israel sets its own eligibility rules, and they change from time to time. In general, trips are for Jewish young adults roughly 18 to 26 who have not previously traveled to Israel on an organized educational program or lived there after age 12. Always check the current requirements on the Birthright Israel website before you register.',
        ],
      },
      {
        h2: 'After Birthright: going back and going deeper',
        body: [
          'Birthright is often a beginning. Students who want more can study for a few weeks or a semester at Mayanot Institute in Jerusalem, join a Chabad on Campus heritage trip such as Living Links, or take the Your Israel course on campus to explore the ideas behind the headlines.',
        ],
      },
      {
        h2: 'How to sign up',
        body: [
          'Registration usually opens several months before each season, and spots fill quickly. The simplest path is to contact your campus Chabad House: they will tell you when their group is traveling and help you register through the Chabad (Mayanot) Birthright application.',
        ],
      },
    ],
    faqs: [
      { q: 'Is Birthright really free?', a: 'The trip itself is a gift for eligible participants. You usually pay a refundable deposit when you register and may need to cover optional extras.' },
      { q: 'Can I go on Birthright with my campus Chabad?', a: 'Many Florida Chabad Houses run their own Birthright groups. If your center does not have a group this season, they can connect you to another Chabad on Campus group.' },
      { q: 'When do Chabad Birthright trips leave?', a: 'Most campus groups travel during winter break or early summer. Registration typically opens a few months in advance.' },
      { q: 'What if I already went to Israel?', a: 'You may not be eligible for Birthright, but there are other ways to go: study programs like Mayanot Institute and heritage trips like Living Links.' },
    ],
    offeredAt: ['uf', 'fsu', 'ucf', 'unf', 'um-undergrad'],
    offeredAtNote: 'Florida centers that have led their own Birthright groups. Students at every Florida Chabad House can join a Chabad trip.',
    officialLinks: [
      { label: 'Birthright Israel eligibility', href: 'https://www.birthrightisrael.com/' },
      { label: 'Mayanot Israel', href: 'https://www.mayanot.com/' },
    ],
    related: ['florida-pegisha', 'your-israel', 'living-links'],
  },
  {
    slug: 'pegisha',
    name: 'International Pegisha',
    shortName: 'International Pegisha',
    category: 'Shabbatons',
    tagline: 'A Shabbat weekend in Crown Heights with thousands of Jewish students from around the world.',
    metaTitle: 'International Pegisha Shabbaton in Crown Heights | Chabad on Campus',
    metaDescription:
      'The International Pegisha brings Jewish college students from around the world to Crown Heights, Brooklyn for a Shabbat weekend. How Florida students can join.',
    logo: '/images/logo-pegisha.webp',
    image: 'fl-pegisha-nyc',
    imageAlt: 'Chabad at FGCU students in Crown Heights, Brooklyn for the International Pegisha',
    audience: 'Jewish college students of every background, registering through their campus Chabad House.',
    format: 'A Shabbat weekend in Crown Heights, Brooklyn, Friday through Sunday, held each fall.',
    cost: 'Priced by each local group, often heavily subsidized. Ask your Chabad House.',
    intro: [
      'Pegisha means "encounter" in Hebrew. Each fall, Jewish students from campuses around the world travel to Crown Heights, Brooklyn, the home of the Chabad movement, for one very big Shabbat together.',
      'Florida students travel to the International Pegisha with their own campus Chabad House, so you go with friends and come home with many more. Closer to home, the <a href="/programs/florida-pegisha/">Florida Pegisha</a> brings students from across the state together each year.',
    ],
    sections: [
      {
        h2: 'The weekend in Crown Heights',
        body: [
          'Students typically arrive Friday, take a walking tour of the neighborhood, and spend Friday night at Shabbat dinners hosted by local families before a farbrengen. Shabbat day includes services, lunch and sessions, followed by a big Havdalah concert and a Saturday night social event. Sunday offers optional tours, including a visit to the Rebbe\'s resting place (the Ohel), a resource fair and a closing program.',
        ],
      },
      {
        h2: 'What students take home',
        body: [
          'Most students come back with new friends from other campuses, a real taste of a full Shabbat, and a sense that they belong to something much larger than their own school. For many, it is the weekend that turns occasional Shabbat dinners into a real connection.',
        ],
      },
    ],
    faqs: [
      { q: 'How do I register for the International Pegisha?', a: 'Registration goes through your campus Chabad House. Contact them to find out when registration opens and how your group is traveling.' },
      { q: 'Is there a fee?', a: 'Yes, but pricing is set by each local group and is usually heavily subsidized. Your Chabad House can tell you the cost for your campus.' },
      { q: 'Are meals included?', a: 'Meals from Friday night through Sunday lunch are provided; you may need your own lunch on Friday or dinner on Sunday.' },
      { q: 'Do I need to be observant to attend?', a: 'No. Pegisha is for Jewish students of every background, and many participants are experiencing a full Shabbat for the first time.' },
      { q: 'How is this different from the Florida Pegisha?', a: 'The International Pegisha gathers students from around the world in New York. The <a href="/programs/florida-pegisha/">Florida Pegisha</a> is our own statewide Shabbaton for students at Florida schools, close to home.' },
    ],
    offeredAt: 'all',
    offeredAtNote: 'Students at every Florida Chabad on Campus center can join the International Pegisha through their own Chabad House.',
    officialLinks: [
      { label: 'Pegisha NYC on Chabad on Campus', href: 'https://chabadoncampus.org/pegisha/' },
    ],
    related: ['florida-pegisha', 'birthright-israel', 'living-links'],
  },
  {
    slug: 'your-israel',
    name: 'Your Israel',
    shortName: 'Your Israel',
    category: 'Learning',
    tagline: 'A six-week course that goes deeper than the politics.',
    metaTitle: 'Your Israel: A Course for Jewish College Students | Chabad on Campus',
    metaDescription:
      'Your Israel is a six-week Chabad on Campus course that helps Jewish college students understand Israel beyond the headlines. See which Florida campuses offer it.',
    logo: '/images/logo-your-israel.webp',
    image: 'fl-rally',
    imageAlt: 'Chabad at UNF students with a North Florida banner at a rally for Israel',
    audience: 'Jewish college students who want to understand Israel and speak about it with confidence.',
    format: 'A six-week course taught at your campus Chabad House.',
    cost: 'Free for students.',
    intro: [
      'Conversations about Israel on campus can be loud, fast and confusing. Your Israel is a six-week Chabad on Campus course designed to slow things down and dig deeper than the politics on the ground, giving students real answers to the questions they hear most.',
      'The course explores what the Land of Israel means in Jewish tradition, how that connection has shaped Jewish identity for thousands of years, and how students can think and talk about Israel today with knowledge and confidence.',
    ],
    sections: [
      {
        h2: 'Why students take it',
        body: [
          'Many students grew up with a warm connection to Israel but never learned the ideas behind it. Others feel pressure to have an opinion on every headline. Your Israel gives both a foundation: the texts, history and meaning behind the Jewish connection to the land, in a setting where every question is welcome.',
        ],
      },
      {
        h2: 'Where it leads',
        body: [
          'Your Israel pairs naturally with an Israel trip. Students often take the course before or after Birthright, and some go on to study in Israel.',
        ],
      },
    ],
    faqs: [
      { q: 'Is Your Israel a political course?', a: 'It is not an advocacy training. The course focuses on the Jewish meaning of Israel and helps students think through current questions from a place of knowledge.' },
      { q: 'How long is the Your Israel course?', a: 'Six weeks, taught in person at participating Chabad Houses.' },
    ],
    offeredAt: 'api:your-israel',
    offeredAtNote: 'Florida centers enrolled in Your Israel, updated daily from Chabad on Campus. Course dates vary by semester.',
    officialLinks: [{ label: 'Chabad on Campus', href: 'https://chabadoncampus.org/' }],
    related: ['birthright-israel', 'jewishu', 'sinai-scholars'],
  },
  {
    slug: 'living-links',
    name: 'Living Links',
    shortName: 'Living Links',
    category: 'Travel & Israel',
    tagline: 'A heritage journey through Jewish Poland: history, memory and renewal.',
    metaTitle: 'Living Links: Jewish Heritage Trip to Poland for College Students',
    metaDescription:
      'Living Links is a Chabad on Campus heritage trip to Poland exploring Jewish history, the Holocaust and the rebirth of Jewish life. Open to Florida college students.',
    logo: '/images/logo-living-links.webp',
    image: 'fl-trip',
    imageAlt: 'Students from Chabad at UNF on a trip, waving from a hilltop',
    audience: 'Jewish college students ready for a meaningful and emotionally significant journey.',
    format: 'A group trip during winter or spring break, led by Chabad on Campus educators.',
    cost: 'Varies by season and is typically subsidized. Your Chabad House will share current details.',
    intro: [
      'Living Links is a Chabad on Campus trip that explores the long Jewish history of Poland, the darkness of the Holocaust and the reemergence of Jewish life today.',
      'Students walk through the towns and synagogues where Jewish life flourished for centuries, stand at the sites of the Holocaust, and meet the people rebuilding Jewish communities in Poland now. It is a trip about the past that leaves students thinking hard about their own future.',
    ],
    sections: [
      {
        h2: 'Why it matters',
        body: [
          'Learning about the Holocaust in a classroom is different from standing where it happened with people you trust. Living Links gives students the history, the space to process it together, and a hopeful ending: Jewish life continues, and they are part of it.',
        ],
      },
      {
        h2: 'When trips run',
        body: [
          'Living Links groups travel in both winter and spring seasons. Florida students register through their own Chabad House, which can share dates, costs and what to expect.',
        ],
      },
    ],
    faqs: [
      { q: 'How do I join a Living Links trip?', a: 'Contact your campus Chabad House. Florida students register through their local center, which enrolls them in an upcoming Living Links group.' },
      { q: 'Is Living Links only about the Holocaust?', a: 'No. The trip covers centuries of Jewish life in Poland, the Holocaust, and the renewal of Jewish community there today.' },
    ],
    offeredAt: 'all',
    offeredAtNote: 'Students at any Florida Chabad on Campus center can register for Living Links through their Chabad House.',
    officialLinks: [{ label: 'Chabad on Campus', href: 'https://chabadoncampus.org/' }],
    related: ['birthright-israel', 'florida-pegisha', 'pegisha'],
  },

  {
    slug: 'soup-delivery',
    name: 'Soup Delivery',
    shortName: 'Soup Delivery',
    category: 'Care & Home',
    tagline: 'Feeling sick? Homemade chicken soup, delivered to your door by your Chabad House.',
    metaTitle: 'Chicken Soup Delivery for Sick College Students | Chabad on Campus Florida',
    metaDescription:
      'Under the weather at college? Florida Chabad Houses deliver homemade chicken soup to students who are sick. Here is how to request a delivery from your campus Chabad.',
    image: 'fl-soup',
    imageAlt: 'A bowl of homemade matzah ball soup from Chabad at UNF',
    audience: 'Any student who is feeling sick, stressed or just far from home.',
    format: 'A delivery of homemade chicken soup, straight to your dorm or apartment.',
    cost: 'Free.',
    intro: [
      'There is a reason they call it Jewish penicillin. When you are sick and far from home, nothing hits quite like a bowl of homemade chicken soup, and your Chabad House is happy to bring it to you.',
      'Just let your rabbi or rebbetzin know you are not feeling well. They will get a container of warm soup to your door, often with a little something extra and a lot of get-well wishes.',
    ],
    sections: [
      {
        h2: 'How it works',
        body: ['Text, call or message your campus Chabad House and tell them where you are. Friends and roommates can request a delivery for someone else, too. Parents often reach out on behalf of a sick student who is too tired to ask.'],
      },
      {
        h2: 'More than soup',
        body: ['A delivery is a small reminder that someone nearby is looking out for you. If you need more than soup, whether that is a ride, a kosher meal or someone to talk to, just ask.'],
      },
    ],
    faqs: [
      { q: 'How do I get soup delivered?', a: 'Contact your campus Chabad House by text, phone or social media and let them know where you are. <a href="/campuses/">Find your Chabad House</a>.' },
      { q: 'Does it cost anything?', a: 'No. Soup deliveries are a free gift from your Chabad House.' },
      { q: 'Can a parent request soup for their child?', a: 'Yes. Parents often reach out when their child is sick. Contact the Chabad House at your child\'s school directly.' },
      { q: 'Is the soup kosher?', a: 'Yes. It is made in your Chabad House\'s kosher kitchen.' },
    ],
    offeredAt: 'all',
    offeredAtNote: 'Reach out to your campus Chabad House to request a delivery.',
    officialLinks: [],
    related: ['mezuzah-loans', 'jewishu', 'florida-pegisha'],
  },
  {
    slug: 'mezuzah-loans',
    name: 'Mezuzah Loans',
    shortName: 'Mezuzah Loans',
    category: 'Care & Home',
    tagline: 'Borrow a kosher mezuzah for your dorm or apartment door, free for the school year.',
    metaTitle: 'Free Mezuzah Loans for College Dorms | Chabad on Campus Florida',
    metaDescription:
      'Put a kosher mezuzah on your dorm or apartment door. Florida Chabad Houses lend mezuzahs to Jewish college students for the school year and help put them up.',
    image: 'fl-mezuzah',
    imageAlt: 'A Chabad rabbi helping a UNF student put up a mezuzah on her dorm door',
    audience: 'Jewish students living in a dorm, apartment or house near campus.',
    format: 'A kosher mezuzah on loan for the year, with help putting it up.',
    cost: 'Free to borrow.',
    intro: [
      'A mezuzah on your door turns a dorm room into a Jewish home. It is one of the most recognizable Jewish symbols, and it reminds everyone who walks through the door of what matters most.',
      'Your Chabad House can lend you a kosher mezuzah for the school year and help you put it up, with a blessing and usually a l\'chaim.',
    ],
    sections: [
      {
        h2: 'Why a real mezuzah matters',
        body: ['The case is just the cover. What makes a mezuzah kosher is the handwritten parchment scroll inside, written by a trained scribe. Many store-bought cases have no kosher scroll, or none at all. A loaned mezuzah from your Chabad House comes with a kosher scroll.'],
      },
      {
        h2: 'Putting it up',
        body: ['The mezuzah goes on the right side of the doorway as you walk in, in the upper third of the doorpost, tilted toward the inside. Your rabbi will be happy to come by, help you hang it and say the blessing with you. Removable mounting works for most dorms.'],
      },
      {
        h2: 'At the end of the year',
        body: ['When you move out, bring the mezuzah back to your Chabad House so the next student can use it, or ask about buying your own to take with you.'],
      },
    ],
    faqs: [
      { q: 'How do I borrow a mezuzah?', a: 'Reach out to your campus Chabad House and let them know where you are living. <a href="/campuses/">Find your Chabad House</a>.' },
      { q: 'Does it cost anything?', a: 'Borrowing a mezuzah for the school year is free.' },
      { q: 'Is a mezuzah allowed in my dorm?', a: 'Many universities allow mezuzahs on dorm doors, and removable mounting avoids damage. If you are unsure, your Chabad House can help you check with housing.' },
      { q: 'What if I already have a mezuzah case?', a: 'Bring it by. Your Chabad House can check whether it has a kosher scroll inside and help you get one if it does not.' },
    ],
    offeredAt: 'all',
    offeredAtNote: 'Reach out to your campus Chabad House to borrow a mezuzah.',
    officialLinks: [],
    related: ['soup-delivery', 'jewishu', 'florida-pegisha'],
  },
];

export const programBySlug = Object.fromEntries(programs.map((p) => [p.slug, p]));
