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
  category: 'Learning' | 'Shabbatons' | 'Travel & Israel';
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
  officialLinks: { label: string; href: string }[];
  related: string[];
};

export const programs: Program[] = [
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
    image: 'class-discussion',
    imageAlt: 'College students seated in a circle during a Jewish learning class at a Chabad House',
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
    related: ['sinai-scholars', 'your-israel', 'study-away-grant'],
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
    image: 'sinai-study-pair',
    imageAlt: 'A rabbi and two college students studying a Jewish text together at a table',
    audience: 'Motivated undergraduates and graduate students who want a serious, structured Jewish learning experience.',
    format: 'Eight two-hour classes over a semester, plus a Shabbat experience, a class retreat and a closing event.',
    cost: 'Free to join. Students who complete all requirements receive a stipend.',
    intro: [
      'Sinai Scholars Society is a joint project of Chabad on Campus International and the Rohr Jewish Learning Institute. It brings a small, selective group of students together for an eight-week course in Jewish thought, taught at their campus Chabad House, and then connects them to a national community of Sinai Scholars.',
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
      { q: 'Who runs Sinai Scholars?', a: 'Sinai Scholars Society is a joint project of Chabad on Campus International and the Rohr Jewish Learning Institute, taught locally by your campus Chabad House.' },
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
      'Go to Israel on Birthright with your Florida Chabad House, plus study programs and travel grants for going back. Eligibility, what to expect and FAQs.',
    image: 'pegisha-group',
    imageAlt: 'A large group of Jewish college students posing together on a Chabad on Campus trip',
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
          'Birthright is often a beginning. Students who want more can study for a few weeks or a semester at Mayanot Institute in Jerusalem, join a Chabad on Campus heritage trip such as Living Links, or take the Your Israel course on campus to explore the ideas behind the headlines. Chabad on Campus also offers the Study Away Grant, which can subsidize travel to immersive Jewish learning programs, including up to $1,000 for programs in Israel.',
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
      { q: 'What if I already went to Israel?', a: 'You may not be eligible for Birthright, but there are other ways to go: study programs like Mayanot Institute, heritage trips, and the Chabad on Campus Study Away Grant.' },
    ],
    offeredAt: ['uf', 'fsu', 'ucf', 'unf', 'um-undergrad'],
    offeredAtNote: 'Florida centers that have led their own Birthright groups. Students at every Florida Chabad House can join a Chabad trip.',
    officialLinks: [
      { label: 'Birthright Israel eligibility', href: 'https://www.birthrightisrael.com/' },
      { label: 'Mayanot Israel', href: 'https://www.mayanot.com/' },
    ],
    related: ['study-away-grant', 'your-israel', 'living-links'],
  },
  {
    slug: 'pegisha',
    name: 'Pegisha Shabbatons',
    shortName: 'Pegisha',
    category: 'Shabbatons',
    tagline: 'A Shabbat weekend with hundreds of Jewish students, in Florida and in New York.',
    metaTitle: 'Pegisha Shabbatons: Florida Regional and NYC | Chabad on Campus',
    metaDescription:
      'Pegisha brings Jewish college students together for unforgettable Shabbat weekends. Learn about the Florida Regional Pegisha and Pegisha NYC in Crown Heights.',
    logo: '/images/logo-pegisha.webp',
    image: 'florida-pegisha-students',
    imageAlt: 'Florida college students in matching Pegisha shirts at the Florida Regional Pegisha Shabbaton',
    audience: 'Jewish college students of every background, registering through their campus Chabad House.',
    format: 'A weekend Shabbaton: Friday through Sunday, with meals, programs, music and time to explore.',
    cost: 'Priced by each local group, often heavily subsidized. Ask your Chabad House.',
    intro: [
      'Pegisha means "encounter" in Hebrew, and that is exactly what it is: a weekend where Jewish students from many campuses meet, celebrate Shabbat together and discover how big and joyful Jewish life can be.',
      'Florida students have two ways to experience it. The Florida Regional Pegisha gathers Chabad on Campus students from across the state for a Shabbaton close to home, and Pegisha NYC brings students from around the world to Crown Heights, Brooklyn, the home of the Chabad movement.',
    ],
    sections: [
      {
        h2: 'Florida Regional Pegisha',
        body: [
          'The Florida Regional Pegisha is a statewide Shabbaton for students at Florida Chabad on Campus centers. It is a chance to meet Jewish students from other Florida schools, spend a full Shabbat together with great food, services, workshops and discussions, and end the weekend with music and celebration. The most recent Florida Regional Pegisha took place April 17 to 19, 2026. Students register through their own campus Chabad House.',
        ],
      },
      {
        h2: 'Pegisha NYC in Crown Heights',
        body: [
          'Pegisha NYC is an invitation-only Shabbat weekend in Crown Heights, Brooklyn, held each fall. Students typically arrive Friday, take a walking tour of the neighborhood, and spend Friday night at Shabbat dinners hosted by local families before a farbrengen. Shabbat day includes services, lunch and sessions, followed by a big Havdalah concert and a Saturday night social event. Sunday offers optional tours, including a visit to the Rebbe\'s resting place (the Ohel), a resource fair and a closing program.',
        ],
      },
      {
        h2: 'What students take home',
        body: [
          'Most students come back from Pegisha with new friends from other campuses, a real taste of a full Shabbat, and a sense that they belong to something much larger than their own school. For many, it is the weekend that turns occasional Shabbat dinners into a real connection.',
        ],
      },
    ],
    faqs: [
      { q: 'How do I register for Pegisha?', a: 'Registration goes through your campus Chabad House. Contact them to find out when registration opens for the next Florida Regional Pegisha or Pegisha NYC.' },
      { q: 'Is there a fee for Pegisha?', a: 'Yes, but pricing is set by each local group and is usually heavily subsidized. Your Chabad House can tell you the cost for your campus.' },
      { q: 'Are meals included?', a: 'Shabbat meals are included. For Pegisha NYC, meals from Friday night through Sunday lunch are provided; you may need your own lunch on Friday or dinner on Sunday.' },
      { q: 'Do I need to be observant to attend?', a: 'No. Pegisha is for Jewish students of every background, and many participants are experiencing a full Shabbat for the first time.' },
    ],
    offeredAt: 'all',
    offeredAtNote: 'Students at every Florida Chabad on Campus center can join the Florida Regional Pegisha and Pegisha NYC through their own Chabad House.',
    officialLinks: [
      { label: 'Pegisha NYC', href: 'https://chabadoncampus.org/pegisha/' },
      { label: 'Regional Pegisha', href: 'https://chabadoncampus.org/regional/' },
    ],
    related: ['birthright-israel', 'sinai-scholars', 'living-links'],
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
    image: 'sinai-seminar',
    imageAlt: 'College students taking notes around a table during a Chabad on Campus course',
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
          'Your Israel pairs naturally with an Israel trip. Students often take the course before or after Birthright, and some go on to study in Israel with support from the Chabad on Campus Study Away Grant.',
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
    image: 'learning-circle',
    imageAlt: 'Students seated in an outdoor circle listening to a Chabad on Campus educator',
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
    related: ['birthright-israel', 'study-away-grant', 'pegisha'],
  },
  {
    slug: 'study-away-grant',
    name: 'Study Away Grant',
    shortName: 'Study Away Grant',
    category: 'Travel & Israel',
    tagline: 'Travel funding for immersive Jewish learning programs.',
    metaTitle: 'Study Away Grant: Travel Funding for Jewish Learning Programs',
    metaDescription:
      'The Chabad on Campus Study Away Grant helps college students travel to immersive Jewish learning programs: up to $350 in North America and up to $1,000 for Israel.',
    logo: '/images/logo-study-away-grant.webp',
    image: 'sinai-workshop',
    imageAlt: 'Students working together at a table during an immersive Jewish learning program',
    audience: 'College students accepted to an eligible immersive Jewish learning program.',
    format: 'A travel subsidy applied to an approved study program over a break or summer.',
    cost: 'A grant, not a loan: up to $350 for travel within North America and up to $1,000 for travel to Israel.',
    intro: [
      'Semester breaks are a perfect time to spend a few weeks learning in an immersive Jewish environment. The Chabad on Campus Study Away Grant helps make that possible by subsidizing travel to a range of Jewish learning programs.',
      'Grants cover up to $350 for travel within North America and up to $1,000 for travel to Israel, which puts programs like a winter or summer session at Mayanot Institute in Jerusalem within reach for many more students.',
    ],
    sections: [
      {
        h2: 'Who it is for',
        body: [
          'The grant is designed for students who have been connected to their campus Chabad and are ready for a deeper learning experience than a semester schedule allows. Your rabbi or rebbetzin can recommend programs that fit your level and interests.',
        ],
      },
      {
        h2: 'How to apply',
        body: [
          'Start with your campus Chabad House. They will help you choose a program, confirm that it is eligible, and apply for the grant through Chabad on Campus.',
        ],
      },
    ],
    faqs: [
      { q: 'How much is the Study Away Grant?', a: 'Up to $350 for travel within North America and up to $1,000 for travel to Israel.' },
      { q: 'Which programs qualify?', a: 'A variety of immersive Jewish learning programs qualify. Your Chabad House can help you find one and confirm eligibility.' },
    ],
    offeredAt: 'all',
    offeredAtNote: 'Available to students connected to any Florida Chabad on Campus center.',
    officialLinks: [{ label: 'Chabad on Campus', href: 'https://chabadoncampus.org/' }],
    related: ['birthright-israel', 'jewishu', 'living-links'],
  },
];

export const programBySlug = Object.fromEntries(programs.map((p) => [p.slug, p]));
