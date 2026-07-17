import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StayEdge — AI-Powered Airbnb Growth",
    short_name: "StayEdge",
    description: "AI-powered Airbnb growth for hosts across South India.",
    start_url: "/",
    display: "standalone",
    background_color: "#171123",
    theme_color: "#171123",
    icons: [
      {
        src: "/brand/logos/stayedge-icon-only.png",
        sizes: "570x540",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
