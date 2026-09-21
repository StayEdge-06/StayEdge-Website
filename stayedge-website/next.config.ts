import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  /**
   * V2 consolidated every conversion path onto /free-audit. These are permanent
   * (308) so Google transfers the existing signals of /roast and /audit rather
   * than treating the new page as unrelated — both had live inbound links and
   * were in the pre-V2 sitemap.
   */
  async redirects() {
    return [
      { source: "/roast", destination: "/free-audit", permanent: true },
      { source: "/roast/:path*", destination: "/free-audit", permanent: true },
      { source: "/audit", destination: "/free-audit", permanent: true },
      { source: "/snapshot", destination: "/free-audit", permanent: true },
    ];
  },
};

export default nextConfig;
