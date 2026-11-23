export const metadata = {
  title: 'Best Colleges in Hyderabad & Degree Colleges in Telangana',
  description: 'Discover the best colleges in Hyderabad, degree colleges in Telangana, government junior colleges, and polytechnics on Career 365 Compass. Check verified college admission eligibility, cutoff marks, streams, and campus facilities.',
  keywords: [
    'Career 365 Compass',
    'Career365Compass',
    'Best colleges in Hyderabad',
    'Degree colleges in Telangana',
    'College admission eligibility',
    'Intermediate colleges in Hyderabad',
    'Government junior colleges Hyderabad',
    'Polytechnic colleges in Telangana',
    'Junior colleges in Hyderabad for MPC',
    'BiPC colleges in Hyderabad'
  ],
  alternates: {
    canonical: '/colleges/',
  },
  openGraph: {
    title: 'Best Colleges in Hyderabad & Degree Colleges in Telangana | Career 365 Compass',
    siteName: 'Career 365 Compass',
    description: 'Find top-rated junior, degree, and polytechnic colleges across Hyderabad & Telangana with verified fee structures and admission eligibility on Career 365 Compass.',
    url: 'https://career365compass.in/colleges/',
    type: 'website',
    images: [
      {
        url: '/images/portal-features.jpg',
        width: 1200,
        height: 630,
        alt: 'Explore Best Colleges in Hyderabad - Career 365 Compass',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Colleges in Hyderabad | Career 365 Compass',
    description: 'Explore verified junior and polytechnic colleges in Hyderabad with fee structures and admission details on Career 365 Compass.',
    images: ['/images/portal-features.jpg'],
  },
};

export default function CollegesLayout({ children }) {
  return children;
}
