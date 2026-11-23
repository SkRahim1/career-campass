export const metadata = {
  title: 'How to Choose a Career After 10th | Student Survey & Stream Guidance',
  description: 'Confused about how to choose a career after 10th? Take our 5-minute student guidance survey on Career 365 Compass (Career365Compass) to find whether MPC, BiPC, MEC, CEC, or Polytechnic diplomas best match your skills and goals.',
  keywords: [
    'Career 365 Compass',
    'Career365Compass',
    'How to choose a career after 10th',
    'Career options after 10th',
    'Best courses after MPC',
    'Courses after BiPC',
    'Stream selection after 10th',
    'Career guidance survey Telangana',
    'Intermediate stream selector'
  ],
  alternates: {
    canonical: '/survey/',
  },
  openGraph: {
    title: 'How to Choose a Career After 10th - Student Guidance Survey | Career 365 Compass',
    siteName: 'Career 365 Compass',
    description: 'Get personalized stream and college suggestions tailored to your 10th class interests and score on Career 365 Compass.',
    url: 'https://career365compass.in/survey/',
    type: 'website',
    images: [
      {
        url: '/images/portal-features.jpg',
        width: 1200,
        height: 630,
        alt: 'Take the Student Career Guidance Survey on Career 365 Compass',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Student Guidance Survey | Career 365 Compass',
    description: 'Find your best stream (MPC, BiPC, MEC, CEC, Polytechnic) in 5 minutes on Career 365 Compass.',
    images: ['/images/portal-features.jpg'],
  },
};

export default function SurveyLayout({ children }) {
  return children;
}
