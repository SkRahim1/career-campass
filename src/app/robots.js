export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/college-portal/',
          '/profile/',
          '/saved-colleges/',
          '/login/',
          '/register/',
        ],
      },
    ],
    sitemap: 'https://career365compass.in/sitemap.xml',
  };
}
