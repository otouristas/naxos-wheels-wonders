import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "www.resrv.gr" },
      { protocol: "https", hostname: "resrv.gr" },
      { protocol: "https", hostname: "naxosautorent.com" },
      { protocol: "https", hostname: "discovercyclades.gr" },
    ],
  },
};

export default withNextIntl(nextConfig);
