import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameSetup } from "./GameSetup";

function renderSetup(
  overrides: { difficulty?: "easy" | "medium" | "hard" } = {},
) {
  const onDifficultyChange = vi.fn();
  const onModeChange = vi.fn();
  const onStart = vi.fn();
  render(
    <GameSetup
      difficulty={overrides.difficulty ?? "medium"}
      mode="either"
      onDifficultyChange={onDifficultyChange}
      onModeChange={onModeChange}
      onStart={onStart}
    />,
  );
  return { onDifficultyChange, onModeChange, onStart };
}

describe("GameSetup", () => {
  it("marks only the active difficulty as pressed", () => {
    renderSetup({ difficulty: "hard" });
    expect(screen.getByRole("button", { name: /^Easy/ })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: /^Hard/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("calls onDifficultyChange with the clicked level", async () => {
    const user = userEvent.setup();
    const { onDifficultyChange } = renderSetup();
    await user.click(screen.getByRole("button", { name: /^Hard/ }));
    expect(onDifficultyChange).toHaveBeenCalledWith("hard");
  });

  it("marks only the active mode as pressed and reports changes", async () => {
    const user = userEvent.setup();
    const { onModeChange } = renderSetup();
    expect(screen.getByRole("button", { name: "Either" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Words" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    await user.click(screen.getByRole("button", { name: "Words" }));
    expect(onModeChange).toHaveBeenCalledWith("word");
  });

  it("calls onStart when the start button is clicked", async () => {
    const user = userEvent.setup();
    const { onStart } = renderSetup();
    await user.click(screen.getByRole("button", { name: "Start game" }));
    expect(onStart).toHaveBeenCalledOnce();
  });
});
