import { test, expect } from "@playwright/test";

// rgb() values below are the light/dark --bg tokens from src/index.css —
// update them here if that palette changes.
test("follows the OS color scheme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(244, 246, 242)",
  );

  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(23, 33, 31)",
  );
});
