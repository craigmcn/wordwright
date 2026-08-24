import "./Keyboard.css";

const ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

interface KeyboardProps {
  guessedLetters: Set<string>;
  correctLetters: Set<string>;
  disabled: boolean;
  onGuess: (letter: string) => void;
}

export function Keyboard({
  guessedLetters,
  correctLetters,
  disabled,
  onGuess,
}: KeyboardProps) {
  return (
    <div className="keyboard">
      {ROWS.map((row, i) => (
        <div key={i} className="keyboard__row">
          {[...row].map((letter) => {
            const guessed = guessedLetters.has(letter);
            const correct = correctLetters.has(letter);
            const className = [
              "keyboard__key",
              guessed && correct && "keyboard__key--correct",
              guessed && !correct && "keyboard__key--wrong",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                key={letter}
                type="button"
                className={className}
                disabled={disabled || guessed}
                onClick={() => onGuess(letter)}
                aria-label={`Guess letter ${letter}`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
