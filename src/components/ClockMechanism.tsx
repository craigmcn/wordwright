import { clockPartStage } from "../lib/gameLogic";
import "./ClockMechanism.css";

interface ClockMechanismProps {
  wrongGuesses: number;
  maxWrongGuesses: number;
  isChiming: boolean;
}

/**
 * Builds a wall clock one piece at a time as wrong guesses come in. Each of
 * the CLOCK_PART_COUNT parts becomes visible once wrongGuesses reaches its
 * scaled stage (see clockPartStage) — the bell is always the last part, so
 * the clock always finishes and chimes on the losing guess.
 */
export function ClockMechanism({
  wrongGuesses,
  maxWrongGuesses,
  isChiming,
}: ClockMechanismProps) {
  const stage = (partIndex: number) =>
    wrongGuesses >= clockPartStage(partIndex, maxWrongGuesses);

  return (
    <svg
      className="clock-mechanism"
      viewBox="0 0 200 260"
      role="img"
      aria-label={`Clock mechanism: ${wrongGuesses} of ${maxWrongGuesses} wrong guesses used`}
    >
      {/* Part 0: wall bracket */}
      {stage(0) && (
        <g className="clock-part">
          <rect
            x="85"
            y="8"
            width="30"
            height="14"
            rx="3"
            fill="var(--brass-dark)"
          />
          <rect x="94" y="18" width="12" height="14" fill="var(--brass-dark)" />
        </g>
      )}

      {/* Part 1: outer case */}
      {stage(1) && (
        <g className="clock-part">
          <rect
            x="30"
            y="30"
            width="140"
            height="150"
            rx="20"
            fill="var(--surface-alt)"
            stroke="var(--brass)"
            strokeWidth="4"
          />
        </g>
      )}

      {/* Part 2: face */}
      {stage(2) && (
        <g className="clock-part">
          <circle
            cx="100"
            cy="105"
            r="58"
            fill="var(--bg-panel)"
            stroke="var(--brass-dark)"
            strokeWidth="3"
          />
        </g>
      )}

      {/* Part 3: hour markers */}
      {stage(3) && (
        <g
          className="clock-part"
          stroke="var(--text)"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <line x1="100" y1="53" x2="100" y2="63" />
          <line x1="100" y1="147" x2="100" y2="157" />
          <line x1="48" y1="105" x2="58" y2="105" />
          <line x1="142" y1="105" x2="152" y2="105" />
        </g>
      )}

      {/* Part 4: hour hand */}
      {stage(4) && (
        <g className="clock-part">
          <line
            x1="100"
            y1="105"
            x2="78"
            y2="88"
            stroke="var(--text)"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* Part 5: minute hand */}
      {stage(5) && (
        <g className="clock-part">
          <line
            x1="100"
            y1="105"
            x2="128"
            y2="65"
            stroke="var(--text)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="100" cy="105" r="4" fill="var(--accent-strong)" />
        </g>
      )}

      {/* Part 6: pendulum */}
      {stage(6) && (
        <g className="clock-part">
          <g className="clock-pendulum">
            <line
              x1="100"
              y1="180"
              x2="100"
              y2="230"
              stroke="var(--brass-dark)"
              strokeWidth="3"
            />
            <circle cx="100" cy="236" r="10" fill="var(--brass)" />
          </g>
        </g>
      )}

      {/* Part 7: bell — the completed, chiming mechanism */}
      {stage(7) && (
        <g className={isChiming ? "clock-part clock-chiming" : "clock-part"}>
          <path
            d="M85 24 Q100 4 115 24 Z"
            fill="var(--wrong)"
            stroke="var(--brass-dark)"
            strokeWidth="2"
          />
          <circle cx="100" cy="24" r="3" fill="var(--brass-dark)" />
          {isChiming && (
            <g className="chime-rings" stroke="var(--wrong)" fill="none">
              <circle
                cx="100"
                cy="16"
                r="14"
                className="chime-ring chime-ring-1"
              />
              <circle
                cx="100"
                cy="16"
                r="14"
                className="chime-ring chime-ring-2"
              />
              <circle
                cx="100"
                cy="16"
                r="14"
                className="chime-ring chime-ring-3"
              />
            </g>
          )}
        </g>
      )}
    </svg>
  );
}
