import { test, expect } from "@playwright/test";

test("shows the title and lets the player guess a letter", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Wordwright" })).toBeVisible();

  await page.getByRole("button", { name: "Start game" }).click();

  const letterButtons = page.getByRole("button", { name: /^Guess letter/ });
  await expect(letterButtons.first()).toBeVisible();

  const button = letterButtons.first();
  await button.click();
  await expect(button).toBeDisabled();
});

test("offers a restart once the game ends", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start game" }).click();

  // Click every letter; the game must end (win or lose) once the alphabet
  // is exhausted, since every entry only uses letters A-Z.
  const letters = "QXZJVBFWKYPGMHDCLURNIOTSAE".split("");
  for (const letter of letters) {
    const button = page.getByRole("button", {
      name: `Guess letter ${letter}`,
    });
    if (await button.isEnabled().catch(() => false)) {
      await button.click();
    }
    if (
      await page
        .getByRole("button", { name: "Play again" })
        .isVisible()
        .catch(() => false)
    ) {
      break;
    }
  }

  await expect(page.getByRole("button", { name: "Play again" })).toBeVisible();
});
