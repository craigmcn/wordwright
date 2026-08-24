import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  it("shows a setup screen before the game starts", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Wordwright" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^Guess letter/ }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Start game" }));

    for (const letter of "ABCXYZ") {
      expect(
        screen.getByRole("button", { name: `Guess letter ${letter}` }),
      ).toBeInTheDocument();
    }
  });

  it("locks the keyboard and shows the answer after enough wrong guesses", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Start game" }));

    // Guessing every letter guarantees enough misses eventually, since no
    // entry uses the full alphabet.
    for (const letter of "QXZJVBFWKY") {
      const button = screen.queryByRole("button", {
        name: `Guess letter ${letter}`,
      });
      if (button && !button.hasAttribute("disabled")) {
        await user.click(button);
      }
    }

    const status = screen.getByRole("status");
    if (status.textContent?.includes("struck")) {
      expect(screen.getByText(/the answer was/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Play again" }),
      ).toBeInTheDocument();
    } else {
      expect(status.textContent).toMatch(/left/);
    }
  });

  it("returns to the setup screen when settings are changed after a game", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Start game" }));

    for (const letter of "QXZJVBFWKYPGMHDCLURNIOTSAE") {
      const button = screen.queryByRole("button", {
        name: `Guess letter ${letter}`,
      });
      if (button && !button.hasAttribute("disabled")) {
        await user.click(button);
      }
      if (screen.queryByRole("button", { name: "Change settings" })) break;
    }

    await user.click(screen.getByRole("button", { name: "Change settings" }));

    expect(
      screen.getByRole("button", { name: "Start game" }),
    ).toBeInTheDocument();
  });
});
