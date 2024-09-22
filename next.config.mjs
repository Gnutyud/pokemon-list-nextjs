/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/pokemon-list",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
