/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "react-scroll-parallax",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.frontstay.com',
      },
    ],
    formats: ["image/webp", "image/avif"],
    qualities: [75, 90, 100],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Configurações para melhor performance
  compress: true,
  poweredByHeader: false,
  // Otimizações para CSS e animações
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Headers de segurança
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
