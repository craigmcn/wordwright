import type { Difficulty, GameState, ModeFilter, WordEntry } from "../types";

/** Total named pieces the clock mechanism can be built from, regardless of difficulty. */
export const CLOCK_PART_COUNT = 8;

interface DifficultyConfig {
  label: string;
  description: string;
  maxWrongGuesses: number;
}

// Fewer allowed misses (and harder entries, via data/entries.ts) at higher
// difficulty; more at lower. 6 wrong guesses is the hangman-standard
// baseline, so medium anchors there.
export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: "Easy",
    description: "Short words, 8 misses allowed",
    maxWrongGuesses: 8,
  },
  medium: {
    label: "Medium",
    description: "Longer words or short phrases, 6 misses allowed",
    maxWrongGuesses: 6,
  },
  hard: {
    label: "Hard",
    description: "Tricky words and phrases, 5 misses allowed",
    maxWrongGuesses: 5,
  },
};

export function filterEntries(
  entries: WordEntry[],
  difficulty: Difficulty,
  mode: ModeFilter,
): WordEntry[] {
  return entries.filter(
    (entry) =>
      entry.difficulty === difficulty &&
      (mode === "either" || entry.type === mode),
  );
}

/** Unique A-Z letters in an entry's text; spaces and punctuation don't need guessing. */
export function getGuessableLetters(text: string): Set<string> {
  const letters = new Set<string>();
  for (const char of text.toUpperCase()) {
    if (/[A-Z]/.test(char)) letters.add(char);
  }
  return letters;
}

export function pickRandomEntry(
  entries: WordEntry[],
  random: () => number = Math.random,
): WordEntry {
  const index = Math.floor(random() * entries.length);
  return entries[index];
}

export function createGame(
  entries: WordEntry[],
  difficulty: Difficulty,
  random: () => number = Math.random,
): GameState {
  return {
    entry: pickRandomEntry(entries, random),
    guessedLetters: new Set(),
    wrongGuesses: 0,
    maxWrongGuesses: DIFFICULTIES[difficulty].maxWrongGuesses,
    status: "playing",
  };
}

/** Wrong-guess count that reveals part `partIndex` (0-based); the last part always lands on the final stage, so the clock chimes on the losing guess. */
export function clockPartStage(
  partIndex: number,
  maxWrongGuesses: number,
): number {
  return Math.ceil(((partIndex + 1) * maxWrongGuesses) / CLOCK_PART_COUNT);
}

function deriveStatus(state: GameState): GameState["status"] {
  if (state.wrongGuesses >= state.maxWrongGuesses) return "lost";
  const required = getGuessableLetters(state.entry.text);
  const solved = [...required].every((letter) =>
    state.guessedLetters.has(letter),
  );
  return solved ? "won" : "playing";
}

export function guessLetter(state: GameState, rawLetter: string): GameState {
  const letter = rawLetter.toUpperCase();
  if (state.status !== "playing" || state.guessedLetters.has(letter)) {
    return state;
  }

  const guessedLetters = new Set(state.guessedLetters);
  guessedLetters.add(letter);

  const wasCorrect = getGuessableLetters(state.entry.text).has(letter);
  const next: GameState = {
    ...state,
    guessedLetters,
    wrongGuesses: wasCorrect ? state.wrongGuesses : state.wrongGuesses + 1,
  };
  return { ...next, status: deriveStatus(next) };
}

export interface DisplayChar {
  char: string;
  revealed: boolean;
}

/** Splits the entry text into display cells: spaces always shown, letters masked until guessed. */
export function getDisplayChars(state: GameState): DisplayChar[] {
  return [...state.entry.text.toUpperCase()].map((char) => ({
    char,
    revealed: char === " " || state.guessedLetters.has(char),
  }));
}
