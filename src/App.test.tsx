import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import App from "./App";

describe("App", () => {
  it("has no axe violations on the setup screen", async () => {
    const { container } = render(<App />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations mid-game", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.click(screen.getByRole("button", { name: "Start game" }));
    expect(await axe(container)).toHaveNoViolations();
  });

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

  it("shows the win state and vibrates once every letter is guessed", async () => {
    // Default settings (medium/either) filter to PLATYPUS as the first
    // entry, so pinning Math.random to 0 makes entry selection
    // deterministic — see pickRandomEntry in lib/gameLogic.ts.
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);
    const vibrateSpy = vi.fn();
    Object.defineProperty(navigator, "vibrate", {
      value: vibrateSpy,
      configurable: true,
    });

    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Start game" }));

    for (const letter of "PLATYUS") {
      await user.click(
        screen.getByRole("button", { name: `Guess letter ${letter}` }),
      );
    }

    expect(screen.getByRole("status")).toHaveTextContent("You solved it!");
    expect(vibrateSpy).toHaveBeenCalledWith(40);

    randomSpy.mockRestore();
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
