import type { DisplayChar } from "../lib/gameLogic";
import "./WordDisplay.css";

interface WordDisplayProps {
  chars: DisplayChar[];
}

export function WordDisplay({ chars }: WordDisplayProps) {
  const spoken = chars
    .map((c) => (c.char === " " ? " " : c.revealed ? c.char : "blank"))
    .join(" ");

  return (
    <div className="word-display">
      <span className="sr-only">{spoken}</span>
      <div aria-hidden="true" className="word-display__row">
        {chars.map((c, i) =>
          c.char === " " ? (
            <span key={i} className="word-display__gap" />
          ) : (
            <span
              key={i}
              className={
                c.revealed
                  ? "word-display__cell word-display__cell--revealed"
                  : "word-display__cell"
              }
            >
              {c.revealed ? c.char : ""}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
