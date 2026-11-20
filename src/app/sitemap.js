import prisma from '@/lib/prisma';

export const dynamic = 'force-static';

export default async function sitemap() {
  const baseUrl = 'https://career365compass.in';

  const staticRoutes = [
    '',
    '/careers',
    '/colleges',
    '/competitive-exams',
    '/admission-updates',
    '/government-colleges',
    '/scholarships',
    '/survey',
    '/about',
    '/compare',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  let dynamicCareers = [];
  try {
    const careers = await prisma.career.findMany({ select: { slug: true } });
    dynamicCareers = careers.map((c) => ({
      url: `${baseUrl}/careers/${c.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (err) {
    console.error('Error fetching careers for sitemap:', err);
  }

  let dynamicExams = [];
  try {
    const exams = await prisma.competitiveExam.findMany({ select: { slug: true } });
    dynamicExams = exams.map((e) => ({
      url: `${baseUrl}/competitive-exams/${e.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (err) {
    console.error('Error fetching exams for sitemap:', err);
  }

  let dynamicColleges = [];
  try {
    const colleges = await prisma.college.findMany({ select: { id: true } });
    dynamicColleges = colleges.map((col) => ({
      url: `${baseUrl}/colleges/${col.id}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (err) {
    console.error('Error fetching colleges for sitemap:', err);
  }

  return [...staticRoutes, ...dynamicCareers, ...dynamicExams, ...dynamicColleges];
}
