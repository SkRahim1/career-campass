import { Outfit, Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '@/styles/globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://career365compass.in'),
  title: {
    default: 'Career365Compass | Career Options After 10th, Courses After 12th & Best Colleges in Hyderabad',
    template: '%s | Career365Compass',
  },
  description: 'Career365Compass is Telangana\'s premier student guidance portal. Explore verified career options after 10th, courses after 12th, best courses after MPC, courses after BiPC, Telangana entrance exams, competitive exams after 12th, and discover the best colleges in Hyderabad & degree colleges in Telangana with complete college admission eligibility criteria.',
  keywords: [
    'Career options after 10th',
    'Courses after 12th',
    'Best colleges in Hyderabad',
    'Degree colleges in Telangana',
    'Competitive exams after 12th',
    'Telangana entrance exams',
    'Best courses after MPC',
    'Courses after BiPC',
    'College admission eligibility',
    'How to choose a career after 10th',
    'Intermediate colleges in Hyderabad',
    'Government junior colleges Telangana',
    'TS POLYCET 2026',
    'TG EAPCET',
    'Polytechnic diploma Hyderabad'
  ],
  authors: [{ name: 'Career365Compass - Excellence Voices' }],
  creator: 'Excellence Voices',
  publisher: 'Career365Compass',
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://career365compass.in/',
    siteName: 'Career365Compass',
    title: 'Career365Compass | Career Options After 10th, Courses After 12th & Best Colleges in Hyderabad',
    description: 'Explore career options after 10th, courses after 12th, best courses after MPC & BiPC, Telangana entrance exams, and degree colleges in Telangana.',
    images: [
      {
        url: '/images/portal-features.jpg',
        width: 1200,
        height: 630,
        alt: 'Career365Compass Student Guidance & College Discovery Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career365Compass | Career Options After 10th & Best Colleges in Hyderabad',
    description: 'Explore career options after 10th, courses after 12th, MPC & BiPC pathways, and college admission eligibility in Telangana.',
    images: ['/images/portal-features.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#020617',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} h-full scroll-smooth`}>
      <body className="font-sans min-h-full flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
