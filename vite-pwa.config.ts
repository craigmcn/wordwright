import { VitePWA, type VitePWAOptions } from "vite-plugin-pwa";

// `base: "./"` in vite.config.ts keeps every generated URL relative, which
// is what makes this manifest work whether the app is served from a domain
// root (Netlify) or a /wordwright/ subdirectory (GitHub Pages) — both are
// produced by the same `yarn build:netlify` invocation via --outDir/--base.
export function pwaPlugin(): ReturnType<typeof VitePWA> {
  const options: Partial<VitePWAOptions> = {
    registerType: "autoUpdate",
    manifest: {
      name: "Wordwright",
      short_name: "Wordwright",
      description:
        "Guess the word or phrase before the clockwork mechanism finishes building and chimes.",
      theme_color: "#201830",
      background_color: "#201830",
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
      // Google Fonts (Baloo 2, Nunito) are loaded from CDN in index.html and
      // drive the game's display/body typefaces — without them cached, an
      // offline reload would fall back to system fonts. CacheFirst is safe
      // since these are versioned URLs that don't change without a code
      // change.
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
