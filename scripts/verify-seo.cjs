const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');

const testPages = [
  'index.html',
  'colleges/6580/index.html',
  'competitive-exams/ts-polycet/index.html',
  'careers/software-engineer/index.html',
  'scholarships/index.html',
  'government-colleges/index.html',
  'about/index.html',
  'compare/index.html',
  'contribute/index.html'
];

console.log('--- VERIFYING GENERATED STATIC HTML SEO ---');

testPages.forEach((file) => {
  const filePath = path.join(outDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`MISSING: ${file}`);
    return;
  }
  const html = fs.readFileSync(filePath, 'utf8');

  // Title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1] : 'NONE';

  // Canonical
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
  const canonical = canonicalMatch ? canonicalMatch[1] : 'NONE';

  // OpenGraph Image
  const ogImgMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
  const ogImg = ogImgMatch ? ogImgMatch[1] : 'NONE';

  // JSON-LD
  const ldMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  let ldSummary = [];
  ldMatches.forEach((m) => {
    try {
      const parsed = JSON.parse(m[1]);
      if (parsed['@graph']) {
        ldSummary.push(...parsed['@graph'].map((x) => x['@type']));
      } else if (parsed['@type']) {
        ldSummary.push(parsed['@type']);
      }
    } catch (e) {
      ldSummary.push('INVALID_JSON');
    }
  });

  // Main content check
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  const mainLength = mainMatch ? mainMatch[1].length : 0;
  const hasAuthSpinner = mainMatch ? mainMatch[1].includes('Verifying session') : false;

  console.log(`\nPage: ${file}`);
  console.log(`  Title: ${title.slice(0, 70)}...`);
  console.log(`  Canonical: ${canonical}`);
  console.log(`  OG Image: ${ogImg}`);
  console.log(`  JSON-LD Schemas: ${ldSummary.join(', ') || 'NONE'}`);
  console.log(`  Main Length: ${mainLength} bytes (Auth Spinner: ${hasAuthSpinner})`);
});

// Sitemap check
const sitemapPath = path.join(outDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const urlCount = (sitemap.match(/<loc>/g) || []).length;
  console.log(`\nSitemap: ${urlCount} URLs generated.`);
}

// Robots check
const robotsPath = path.join(outDir, 'robots.txt');
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  console.log(`Robots.txt size: ${robots.length} bytes.`);
}
