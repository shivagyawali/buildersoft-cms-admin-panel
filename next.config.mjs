/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    domains: [
      "scontent.fktm18-1.fna.fbcdn.net",
      "www.google.com",
      "ui-avatars.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/api/**", // Allow images from this path
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
