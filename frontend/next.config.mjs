/** @type {import('next').NextConfig} */
const nextConfig = {};

export default {
    experimental: {
        optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
      },
};
