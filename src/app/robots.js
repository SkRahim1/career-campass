export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/profile', '/college-portal'],
      },
    ],
    sitemap: 'https://career365compass.in/sitemap.xml',
  };
}
