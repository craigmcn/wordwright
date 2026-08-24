import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3170",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "yarn dev",
      url: "http://localhost:3170",
      reuseExistingServer: !process.env.CI,
    },
    {
      // The service worker only activates on a production build — the dev
      // server (above) has no PWA behavior to test offline against.
      command: "yarn build && yarn preview",
      url: "http://localhost:3171",
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
});
