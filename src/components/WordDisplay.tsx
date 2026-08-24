import type { DisplayChar } from "../lib/gameLogic";
import "./WordDisplay.css";

interface WordDisplayProps {
  chars: DisplayChar[];
}

/** Groups display chars into per-word runs, split on the space chars. */
function groupIntoWords(chars: DisplayChar[]): DisplayChar[][] {
  const words: DisplayChar[][] = [];
  let current: DisplayChar[] = [];
  for (const c of chars) {
    if (c.char === " ") {
      if (current.length) words.push(current);
      current = [];
    } else {
      current.push(c);
    }
  }
  if (current.length) words.push(current);
  return words;
}

export function WordDisplay({ chars }: WordDisplayProps) {
  const spoken = chars
    .map((c) => (c.char === " " ? " " : c.revealed ? c.char : "blank"))
    .join(" ");
  const words = groupIntoWords(chars);

  return (
    <div className="word-display">
      <span className="sr-only">{spoken}</span>
      {/* Each word is its own flex item so the row only wraps between
          words, never in the middle of one. */}
      <div aria-hidden="true" className="word-display__row">
        {words.map((word, wi) => (
          <div key={wi} className="word-display__word">
            {word.map((c, i) => (
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
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
