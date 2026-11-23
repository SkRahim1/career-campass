export const metadata = {
  title: 'College Admission Eligibility & Admission Updates in Telangana',
  description: 'Stay updated on college admission eligibility, DOST degree notifications, TS POLYCET counseling, and intermediate admissions across colleges in Telangana on Career 365 Compass (Career365Compass).',
  keywords: [
    'Career 365 Compass',
    'Career365Compass',
    'College admission eligibility',
    'Degree colleges in Telangana',
    'Telangana entrance exams',
    'Telangana admission updates',
    'DOST Telangana 2026',
    'TS POLYCET counseling dates',
    'Government junior college admissions'
  ],
  alternates: {
    canonical: '/admission-updates/',
  },
  openGraph: {
    title: 'College Admission Eligibility & Updates | Career 365 Compass',
    siteName: 'Career 365 Compass',
    description: 'Real-time admission alerts, cutoffs, counseling dates, and eligibility rules for colleges across Telangana on Career 365 Compass.',
    url: 'https://career365compass.in/admission-updates/',
    type: 'website',
    images: [
      {
        url: '/images/portal-features.jpg',
        width: 1200,
        height: 630,
        alt: 'Telangana College Admission Alerts & Eligibility Updates - Career 365 Compass',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Admission Updates Telangana | Career 365 Compass',
    description: 'Latest notification alerts for DOST, POLYCET, and junior college admissions on Career 365 Compass.',
    images: ['/images/portal-features.jpg'],
  },
};

export default function AdmissionUpdatesLayout({ children }) {
  return children;
}
