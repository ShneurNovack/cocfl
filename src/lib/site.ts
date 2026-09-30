export const SITE = {
  name: 'Chabad on Campus Florida',
  shortName: 'COC Florida',
  url: 'https://chabadoncampusfl.org',
  description:
    'Chabad on Campus Florida connects Jewish college students with Chabad Houses at universities across Florida: Shabbat dinners, Jewish holidays, kosher food, learning, Israel trips and a home away from home.',
  ogImage: '/images/florida-pegisha-students-1280.webp',
  locale: 'en_US',
  instagram: 'https://www.instagram.com/chabadoncampusfl/',
  // Organization-reported figures kept from the original site. Edit here.
  reported: {
    students: '26,000',
    studentsServed: '30k',
    engagements: '127k',
    engagementsYear: '2025',
  },
};

export const TESTIMONIALS = [
  { quote: "Chabad gives me a space to feel comfortable being Jewish. It's a great place to feel supported.", name: 'Sophie L.', school: 'University of Florida', center: 'uf' },
  {
    quote: "When I started as a freshman, I was worried about finding community. I came with a friend to Rosh Hashanah and we found the Rabbi's words so encouraging. I began coming to Chabad regularly, not just for the High Holidays.",
    name: 'Shayna Fraley',
    school: 'Florida State University',
    center: 'fsu',
  },
  {
    quote: 'When I moved to Jacksonville, I knew nobody. Chabad at UNF welcomed me with open arms. I made a bunch of new friends and found a home away from home. I am so thankful to be able to call them my second family.',
    name: 'Samantha Rosenbloom',
    school: 'University of North Florida',
    center: 'unf',
  },
];

export const NAV = [
  { href: '/campuses/', label: 'Find Your Campus' },
  { href: '/programs/', label: 'Programs' },
  { href: '/jewish-life-on-campus/', label: 'Jewish Life' },
  { href: '/parents/', label: 'Parents' },
  { href: '/about/', label: 'About' },
  { href: '/support/', label: 'Support' },
];

import sizes from './image-sizes.json';

/** Responsive attributes for an optimized image in /public/images. */
export function img(key: string) {
  const big = (sizes as Record<string, { w: number; h: number }>)[`${key}-1280`];
  const small = (sizes as Record<string, { w: number; h: number }>)[`${key}-640`];
  if (!big) throw new Error(`Unknown image key: ${key}`);
  return {
    src: `/images/${key}-1280.webp`,
    srcset: `/images/${key}-640.webp ${small.w}w, /images/${key}-1280.webp ${big.w}w`,
    width: big.w,
    height: big.h,
  };
}
