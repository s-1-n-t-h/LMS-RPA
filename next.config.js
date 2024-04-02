/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["utfs.io"],
  },
  experimental: {
    serverComponents: true, // Enable server components
    serverComponentsMiddleware: true, // Enable middleware for server components
    serverActions: true, // Enable server actions
  },
};

module.exports = nextConfig;
