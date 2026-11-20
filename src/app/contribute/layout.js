export const metadata = {
  title: 'Contribute College Information & Add New Institution | Community Portal',
  description: 'Help Telangana students make informed career choices. Volunteer to submit verified information about Junior Colleges, Polytechnics, or ITIs in Hyderabad and Telangana.',
  keywords: [
    'Contribute college details',
    'Add college Hyderabad',
    'Volunteer educational guidance',
    'Career365Compass volunteer',
    'Telangana college submission'
  ],
  alternates: {
    canonical: '/contribute/',
  },
  openGraph: {
    title: 'Contribute College Information | Career365Compass',
    description: 'Help 10th-grade students find verified college information across Telangana.',
    url: 'https://career365compass.in/contribute/',
    type: 'website',
    images: [
      {
        url: '/images/portal-features.jpg',
        width: 1200,
        height: 630,
        alt: 'Volunteer and contribute college data to Career365Compass',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contribute College Information | Career365Compass',
    description: 'Volunteer to add or verify college information for students in Hyderabad.',
    images: ['/images/portal-features.jpg'],
  },
};

export default function ContributeLayout({ children }) {
  return children;
}
