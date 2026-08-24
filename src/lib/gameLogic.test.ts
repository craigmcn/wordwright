import { describe, expect, it } from "vitest";
import {
  CLOCK_PART_COUNT,
  DIFFICULTIES,
  clockPartStage,
  createGame,
  filterEntries,
  getDisplayChars,
  getGuessableLetters,
  guessLetter,
  pickRandomEntry,
} from "./gameLogic";
import type { WordEntry } from "../types";

const entries: WordEntry[] = [
  { text: "CAT", category: "Animals", type: "word", difficulty: "easy" },
  { text: "OWL", category: "Animals", type: "word", difficulty: "easy" },
];

describe("getGuessableLetters", () => {
  it("returns unique uppercase letters, ignoring spaces", () => {
    expect(getGuessableLetters("hat trick")).toEqual(
      new Set(["H", "A", "T", "R", "I", "C", "K"]),
    );
  });
});

describe("pickRandomEntry", () => {
  it("uses the injected random function to select an entry", () => {
    expect(pickRandomEntry(entries, () => 0)).toBe(entries[0]);
    expect(pickRandomEntry(entries, () => 0.99)).toBe(entries[1]);
  });
});

describe("filterEntries", () => {
  const mixed: WordEntry[] = [
    { text: "CAT", category: "Animals", type: "word", difficulty: "easy" },
    {
      text: "HAT TRICK",
      category: "Sports",
      type: "phrase",
      difficulty: "easy",
    },
    { text: "NARWHAL", category: "Animals", type: "word", difficulty: "hard" },
  ];

  it("filters by difficulty and an exact mode", () => {
    expect(filterEntries(mixed, "easy", "word")).toEqual([mixed[0]]);
    expect(filterEntries(mixed, "easy", "phrase")).toEqual([mixed[1]]);
  });

  it("includes both types when mode is 'either'", () => {
    expect(filterEntries(mixed, "easy", "either")).toEqual([
      mixed[0],
      mixed[1],
    ]);
  });
});

describe("clockPartStage", () => {
  it("maps parts one-to-one when maxWrongGuesses equals CLOCK_PART_COUNT", () => {
    for (let i = 0; i < CLOCK_PART_COUNT; i++) {
      expect(clockPartStage(i, CLOCK_PART_COUNT)).toBe(i + 1);
    }
  });

  it("always lands the final part on the final stage", () => {
    for (const { maxWrongGuesses } of Object.values(DIFFICULTIES)) {
      expect(clockPartStage(CLOCK_PART_COUNT - 1, maxWrongGuesses)).toBe(
        maxWrongGuesses,
      );
    }
  });

  it("produces non-decreasing stages as parts progress", () => {
    const stages = Array.from({ length: CLOCK_PART_COUNT }, (_, i) =>
      clockPartStage(i, 5),
    );
    for (let i = 1; i < stages.length; i++) {
      expect(stages[i]).toBeGreaterThanOrEqual(stages[i - 1]);
    }
  });
});

describe("guessLetter", () => {
  it("reveals a correct letter without adding a wrong guess", () => {
    const state = createGame(entries, "easy", () => 0); // CAT
    const next = guessLetter(state, "c");
    expect(next.guessedLetters.has("C")).toBe(true);
    expect(next.wrongGuesses).toBe(0);
    expect(next.status).toBe("playing");
  });

  it("counts an incorrect letter as a wrong guess", () => {
    const state = createGame(entries, "easy", () => 0); // CAT
    const next = guessLetter(state, "Z");
    expect(next.wrongGuesses).toBe(1);
    expect(next.status).toBe("playing");
  });

  it("ignores a letter that was already guessed", () => {
    const state = createGame(entries, "easy", () => 0); // CAT
    const once = guessLetter(state, "Z");
    const twice = guessLetter(once, "Z");
    expect(twice.wrongGuesses).toBe(1);
    expect(twice).toEqual(once);
  });

  it("wins once every letter in the entry has been guessed", () => {
    let state = createGame(entries, "easy", () => 0); // CAT
    for (const letter of ["C", "A", "T"]) {
      state = guessLetter(state, letter);
    }
    expect(state.status).toBe("won");
  });

  it("loses once wrong guesses reach the difficulty's max", () => {
    let state = createGame(entries, "hard", () => 0); // CAT, hard = 5 misses
    for (const letter of ["Q", "X", "Z", "J", "V", "B", "F"]) {
      state = guessLetter(state, letter);
    }
    expect(state.wrongGuesses).toBe(DIFFICULTIES.hard.maxWrongGuesses);
    expect(state.status).toBe("lost");
  });

  it("stops accepting guesses once the game is over", () => {
    let state = createGame(entries, "easy", () => 0); // CAT
    for (const letter of ["C", "A", "T"]) {
      state = guessLetter(state, letter);
    }
    const afterWin = guessLetter(state, "Z");
    expect(afterWin).toBe(state);
  });
});

describe("getDisplayChars", () => {
  it("reveals spaces but masks unguessed letters", () => {
    const state = createGame(
      [
        {
          text: "HAT TRICK",
          category: "Sports",
          type: "phrase",
          difficulty: "easy",
        },
      ],
      "easy",
      () => 0,
    );
    const withGuess = guessLetter(state, "H");
    const chars = getDisplayChars(withGuess);
    expect(chars[0]).toEqual({ char: "H", revealed: true });
    expect(chars[1]).toEqual({ char: "A", revealed: false });
    expect(chars[3]).toEqual({ char: " ", revealed: true });
  });
});
