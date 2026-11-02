/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/career-campass',
  assetPrefix: '/career-campass/',
};

export default nextConfig;
