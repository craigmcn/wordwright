import { DIFFICULTIES } from "../lib/gameLogic";
import type { Difficulty, ModeFilter } from "../types";
import "./GameSetup.css";

const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard"];

const MODES: { value: ModeFilter; label: string }[] = [
  { value: "word", label: "Words" },
  { value: "phrase", label: "Phrases" },
  { value: "either", label: "Either" },
];

interface GameSetupProps {
  difficulty: Difficulty;
  mode: ModeFilter;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onModeChange: (mode: ModeFilter) => void;
  onStart: () => void;
}

export function GameSetup({
  difficulty,
  mode,
  onDifficultyChange,
  onModeChange,
  onStart,
}: GameSetupProps) {
  return (
    <div className="game-setup">
      <fieldset className="game-setup__group">
        <legend>Difficulty</legend>
        <div className="game-setup__options">
          {DIFFICULTY_ORDER.map((level) => (
            <button
              key={level}
              type="button"
              className={
                level === difficulty
                  ? "game-setup__option game-setup__option--selected"
                  : "game-setup__option"
              }
              aria-pressed={level === difficulty}
              onClick={() => onDifficultyChange(level)}
            >
              <span className="game-setup__option-label">
                {DIFFICULTIES[level].label}
              </span>
              <span className="game-setup__option-hint">
                {DIFFICULTIES[level].description}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="game-setup__group">
        <legend>Word or phrase</legend>
        <div className="game-setup__options">
          {MODES.map((option) => (
            <button
              key={option.value}
              type="button"
              className={
                option.value === mode
                  ? "game-setup__option game-setup__option--selected"
                  : "game-setup__option"
              }
              aria-pressed={option.value === mode}
              onClick={() => onModeChange(option.value)}
            >
              <span className="game-setup__option-label">{option.label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <button type="button" className="game-setup__start" onClick={onStart}>
        Start game
      </button>
    </div>
  );
}
