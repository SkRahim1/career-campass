export const metadata = {
  title: 'College Admission Eligibility & Admission Updates in Telangana',
  description: 'Stay updated on college admission eligibility, DOST degree notifications, TS POLYCET counseling, intermediate admissions, and scholarship deadlines across colleges in Telangana.',
  keywords: [
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
    title: 'College Admission Eligibility & Updates | Career365Compass',
    description: 'Real-time admission alerts, cutoffs, counseling dates, and eligibility rules for colleges across Telangana.',
    url: 'https://career365compass.in/admission-updates/',
    type: 'website',
    images: [
      {
        url: '/images/portal-features.jpg',
        width: 1200,
        height: 630,
        alt: 'Telangana College Admission Alerts & Eligibility Updates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Admission Updates Telangana | Career365Compass',
    description: 'Latest notification alerts for DOST, POLYCET, and junior college admissions in Telangana.',
    images: ['/images/portal-features.jpg'],
  },
};

export default function AdmissionUpdatesLayout({ children }) {
  return children;
}
