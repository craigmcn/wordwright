export type EntryType = "word" | "phrase";
export type Difficulty = "easy" | "medium" | "hard";

export interface WordEntry {
  text: string;
  category: string;
  type: EntryType;
  difficulty: Difficulty;
}

/** What the player wants to be quizzed on; "either" draws from both pools. */
export type ModeFilter = EntryType | "either";

export type GameStatus = "playing" | "won" | "lost";

export interface GameState {
  entry: WordEntry;
  guessedLetters: Set<string>;
  wrongGuesses: number;
  maxWrongGuesses: number;
  status: GameStatus;
}
