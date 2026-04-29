import type { NextConfig } from "next";

// Front plugin iframe: https://dev.frontapp.com/docs/security
const FRAME_ANCESTORS =
  "frame-ancestors https://*.frontapp.com https://*.frontapplication.com";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: FRAME_ANCESTORS,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
