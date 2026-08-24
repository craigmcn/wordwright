import { test, expect } from "@playwright/test";

test.use({ baseURL: "http://localhost:3171" });

test("works offline after the service worker has cached the app shell", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Wordwright" })).toBeVisible();

  await page.waitForFunction(() =>
    navigator.serviceWorker.ready.then((r) => Boolean(r.active)),
  );

  await page.context().setOffline(true);
  await page.reload();

  await expect(page.getByRole("heading", { name: "Wordwright" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Start game" })).toBeVisible();
});
