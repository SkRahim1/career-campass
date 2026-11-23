export const metadata = {
  title: 'Compare Colleges Side-by-Side | Fees, Facilities & Affiliation',
  description: 'Compare up to 4 junior colleges, polytechnics, and ITIs in Hyderabad side-by-side on Career 365 Compass (Career365Compass). Compare annual fee structures, board affiliations, hostel facilities, and verified ratings.',
  keywords: [
    'Career 365 Compass',
    'Career365Compass',
    'Compare colleges Hyderabad',
    'Junior college fee comparison',
    'Best colleges in Hyderabad comparison',
    'Intermediate colleges comparison',
    'Polytechnic fee comparison'
  ],
  alternates: {
    canonical: '/compare/',
  },
  openGraph: {
    title: 'Compare Colleges Side-by-Side | Career 365 Compass',
    siteName: 'Career 365 Compass',
    description: 'Compare annual fee structures, facilities, and streams of top colleges in Hyderabad on Career 365 Compass.',
    url: 'https://career365compass.in/compare/',
    type: 'website',
    images: [
      {
        url: '/images/portal-features.jpg',
        width: 1200,
        height: 630,
        alt: 'Side-by-side college comparison on Career 365 Compass',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare Colleges in Hyderabad | Career 365 Compass',
    description: 'Side-by-side comparison of intermediate and polytechnic colleges on Career 365 Compass.',
    images: ['/images/portal-features.jpg'],
  },
};

export default function CompareLayout({ children }) {
  return children;
}
