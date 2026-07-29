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
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
