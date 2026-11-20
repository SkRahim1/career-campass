export const metadata = {
  title: 'Telangana Entrance Exams & Competitive Exams After 12th & 10th',
  description: 'Complete directory of Telangana entrance exams and competitive exams after 12th and 10th. Check TS POLYCET, TG EAPCET, TG APRJC, NEET, JEE Main, NDA eligibility, exam patterns, and online application guidelines.',
  keywords: [
    'Competitive exams after 12th',
    'Telangana entrance exams',
    'TS POLYCET 2026',
    'TG EAPCET 2026',
    'TG APRJC',
    'Exams after 10th in Telangana',
    'Entrance exams for intermediate admissions'
  ],
  alternates: {
    canonical: '/competitive-exams/',
  },
  openGraph: {
    title: 'Telangana Entrance Exams & Competitive Exams After 12th | Career365Compass',
    description: 'Explore all upcoming competitive exams after 12th and state entrance exams in Telangana with eligibility and step-by-step application walkthroughs.',
    url: 'https://career365compass.in/competitive-exams/',
    type: 'website',
    images: [
      {
        url: '/images/portal-features.jpg',
        width: 1200,
        height: 630,
        alt: 'Telangana Entrance Examinations & Competitive Tests Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Telangana Entrance Exams | Career365Compass',
    description: 'Explore POLYCET, APRJC, EAPCET, JEE, NEET and entrance exams after 10th & 12th.',
    images: ['/images/portal-features.jpg'],
  },
};

export default function CompetitiveExamsLayout({ children }) {
  return children;
}
