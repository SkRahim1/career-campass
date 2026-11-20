import prisma from '@/lib/prisma';

export const dynamic = 'force-static';

export default async function sitemap() {
  const baseUrl = 'https://career365compass.in';

  const staticHubs = [
    { route: '/', priority: 1.0, freq: 'daily' },
    { route: '/colleges/', priority: 0.9, freq: 'daily' },
    { route: '/careers/', priority: 0.9, freq: 'daily' },
    { route: '/competitive-exams/', priority: 0.9, freq: 'daily' },
    { route: '/government-colleges/', priority: 0.9, freq: 'daily' },
    { route: '/scholarships/', priority: 0.9, freq: 'weekly' },
    { route: '/admission-updates/', priority: 0.9, freq: 'daily' },
    { route: '/survey/', priority: 0.8, freq: 'monthly' },
    { route: '/about/', priority: 0.7, freq: 'monthly' },
    { route: '/compare/', priority: 0.7, freq: 'monthly' },
    { route: '/contribute/', priority: 0.7, freq: 'monthly' },
  ].map((item) => ({
    url: `${baseUrl}${item.route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: item.freq,
    priority: item.priority,
  }));

  let dynamicCareers = [];
  try {
    const careers = await prisma.career.findMany({ select: { slug: true } });
    dynamicCareers = careers.map((c) => ({
      url: `${baseUrl}/careers/${c.slug}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (err) {
    console.error('Error fetching careers for sitemap:', err);
  }

  let dynamicExams = [];
  try {
    const exams = await prisma.competitiveExam.findMany({ select: { slug: true } });
    dynamicExams = exams.map((e) => ({
      url: `${baseUrl}/competitive-exams/${e.slug}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (err) {
    console.error('Error fetching exams for sitemap:', err);
  }

  let dynamicColleges = [];
  try {
    const colleges = await prisma.college.findMany({ select: { id: true } });
    dynamicColleges = colleges.map((col) => ({
      url: `${baseUrl}/colleges/${col.id}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (err) {
    console.error('Error fetching colleges for sitemap:', err);
  }

  return [...staticHubs, ...dynamicCareers, ...dynamicExams, ...dynamicColleges];
}

