export const metadata = {
  title: 'Government Junior Colleges & Degree Colleges in Telangana',
  description: 'Explore verified Government Junior Colleges and degree colleges in Telangana and Hyderabad on Career 365 Compass (Career365Compass). Free admission, zero tuition fees, ePASS scholarship criteria, and reservation quota guidelines.',
  keywords: [
    'Career 365 Compass',
    'Career365Compass',
    'Best colleges in Hyderabad',
    'Degree colleges in Telangana',
    'College admission eligibility',
    'Government junior colleges in Hyderabad',
    'Free intermediate education Telangana',
    'TS government colleges list',
    'Masab Tank polytechnic',
    'City College Hyderabad intermediate'
  ],
  alternates: {
    canonical: '/government-colleges/',
  },
  openGraph: {
    title: 'Government Colleges in Hyderabad & Telangana | Career 365 Compass',
    siteName: 'Career 365 Compass',
    description: 'Find top state-funded government junior colleges and polytechnics across Hyderabad on Career 365 Compass with zero tuition fees and hostel facilities.',
    url: 'https://career365compass.in/government-colleges/',
    type: 'website',
    images: [
      {
        url: '/images/portal-features.jpg',
        width: 1200,
        height: 630,
        alt: 'Telangana Government Junior Colleges and Polytechnics Guide - Career 365 Compass',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Government Colleges in Telangana | Career 365 Compass',
    description: 'Explore verified Government Junior Colleges with zero fees, hostels, and reservation guidelines in Hyderabad on Career 365 Compass.',
    images: ['/images/portal-features.jpg'],
  },
};

export default function GovernmentCollegesLayout({ children }) {
  return children;
}
