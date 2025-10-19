/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "staticmap.openstreetmap.de",
      },
    ],
  },
};

export default nextConfig;