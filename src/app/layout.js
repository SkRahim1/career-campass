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
  title: 'Career Compass | College Discovery & Career Guidance after 10th',
  description: 'Career Compass helps 10th class students explore Intermediate streams, Polytechnic diplomas, ITIs, and scholarships. Compare colleges and discover your career roadmap.',
  keywords: 'best intermediate colleges hyderabad, government junior colleges hyderabad, polytechnic colleges hyderabad, career guidance after 10th',
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
