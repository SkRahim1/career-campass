export const metadata = {
  title: 'Compare Colleges Side-by-Side | Fees, Facilities & Affiliation',
  description: 'Compare up to 4 junior colleges, polytechnics, and ITIs in Hyderabad side-by-side. Compare annual fee structures, board affiliations, hostel facilities, and verified ratings.',
  keywords: [
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
    title: 'Compare Colleges Side-by-Side | Career365Compass',
    description: 'Compare annual fee structures, facilities, and streams of top colleges in Hyderabad.',
    url: 'https://career365compass.in/compare/',
    type: 'website',
    images: [
      {
        url: '/images/portal-features.jpg',
        width: 1200,
        height: 630,
        alt: 'Side-by-side college comparison on Career365Compass',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare Colleges in Hyderabad | Career365Compass',
    description: 'Side-by-side comparison of intermediate and polytechnic colleges.',
    images: ['/images/portal-features.jpg'],
  },
};

export default function CompareLayout({ children }) {
  return children;
}
