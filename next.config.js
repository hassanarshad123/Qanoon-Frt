const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  turbopack: {},
  async rewrites() {
    // Only proxy to FastAPI backend when FASTAPI_URL is explicitly set
    if (!process.env.FASTAPI_URL) return [];
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.FASTAPI_URL}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = withSentryConfig(nextConfig, {
  // Suppress logs during build
  silent: true,

  // Upload source maps for better stack traces in production
  widenClientFileUpload: true,

  // Hide source maps from users
  hideSourceMaps: true,

  // Tree-shake Sentry logger statements
  disableLogger: true,
});
