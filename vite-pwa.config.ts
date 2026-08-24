import { VitePWA, type VitePWAOptions } from "vite-plugin-pwa";

// base: "./" in vite.config.ts keeps generated URLs relative, so this
// manifest works whether served from a domain root or a /wordwright/ subpath.
export function pwaPlugin(): ReturnType<typeof VitePWA> {
  const options: Partial<VitePWAOptions> = {
    registerType: "autoUpdate",
    manifest: {
      name: "Wordwright",
      short_name: "Wordwright",
      description:
        "Guess the word or phrase before the clockwork mechanism finishes building and chimes.",
      theme_color: "#17211f",
      background_color: "#17211f",
      display: "standalone",
      start_url: ".",
      scope: ".",
      icons: [
        { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
        {
          src: "icons/icon-maskable-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
      // Google Fonts are loaded from CDN; cache them so an offline reload
      // doesn't fall back to system fonts.
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
          handler: "CacheFirst",
          options: {
            cacheName: "google-fonts",
            expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
    },
  };

  return VitePWA(options);
}
