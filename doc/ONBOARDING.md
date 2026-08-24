# Onboarding: Wordwright

Welcome! This doc walks through the codebase from scratch, assuming you know
React and TypeScript but nothing about this project yet. Read it top to
bottom once, then use it as a map when you need to find something later.

## What the app does

Wordwright is a hangman-style game: the player guesses letters to reveal a
hidden word or phrase. Instead of drawing a hanged figure, each wrong guess
adds a piece to a wall clock. If the clock gets fully built before the player
finds every letter, it chimes and the game is lost. Find all the letters
first and you win.

Before a round starts, the player picks:

- a **difficulty** (Easy / Medium / Hard), which controls how many wrong
  guesses they're allowed, and
- a **mode** (Words / Phrases / Either), which controls what kind of entry
  gets picked.

## Where to start reading

Read the files in this order — each one only makes sense once you understand
the one before it:

1. **[`src/types.ts`](../src/types.ts)** — the vocabulary of the whole app in
   ~20 lines. `WordEntry` (a thing to guess), `GameState` (everything about
   one round in progress), `Difficulty`, `ModeFilter`. Nothing here does
   anything; it's just shapes.

2. **[`src/lib/gameLogic.ts`](../src/lib/gameLogic.ts)** — the actual game
   rules, with zero React in it. This is deliberate: you can read, test, and
   reason about "what happens when you guess a letter" without thinking
   about rendering at all. Key functions:
   - `createGame(entries, difficulty, random?)` — picks a random entry and
     returns a fresh `GameState`. The optional `random` parameter is how
     tests make "random" selection deterministic (pass `() => 0` to always
     get the first entry).
   - `guessLetter(state, letter)` — the one function that changes anything.
     It takes a `GameState` and a letter and returns a **new** `GameState`
     (it never mutates the one you passed in). If the game is already over,
     or the letter was already guessed, it just returns the same state back
     unchanged.
   - `getDisplayChars(state)` — turns the entry text into an array of
     `{ char, revealed }` cells for the UI to render as blanks/letters.
   - `clockPartStage(partIndex, maxWrongGuesses)` — the trickiest bit of
     math in the codebase. Read the "Why the clock math looks like this"
     section below before touching it.

   Start with **[`src/lib/gameLogic.test.ts`](../src/lib/gameLogic.test.ts)**
   if you'd rather learn by example — every function above has tests that
   double as usage examples.

3. **[`src/data/entries.ts`](../src/data/entries.ts)** — the word/phrase
   bank. Each entry is `{ text, category, type, difficulty }`. This is just
   data; skim it to see the shape, then move on.

4. **[`src/App.tsx`](../src/App.tsx)** — where game logic meets the screen.
   `App` holds three pieces of state: `difficulty`, `mode`, and `game`
   (`GameState | null`). When `game` is `null`, it renders the settings
   screen (`GameSetup`); otherwise it renders the board (`GameBoard`, defined
   further down in the same file). `GameBoard` is a plain function that
   takes the current `game` plus a few callbacks — it doesn't own any state
   itself.

5. **`src/components/`** — the pieces `GameBoard` and `App` render:
   - `GameSetup.tsx` — the difficulty/mode picker shown before a round.
   - `ClockMechanism.tsx` — the SVG clock. See the dedicated section below.
   - `WordDisplay.tsx` — the row of letter blanks.
   - `Keyboard.tsx` — the on-screen A–Z keyboard.

   Each component has a matching `.css` file next to it. Global tokens
   (colors, fonts) live in `src/index.css` — component CSS only ever
   references `var(--token-name)`, never a hardcoded color, so light/dark
   mode (see `prefers-color-scheme` in `index.css`) stays consistent
   everywhere without each component having to think about it.

That's the whole app. There's no router, no global state library, no
backend — `App.tsx`'s local state is the entire source of truth.

## Why the clock math looks like this

The clock always has exactly **8 named parts** (`CLOCK_PART_COUNT` in
`gameLogic.ts`): bracket, case, face, markers, hour hand, minute hand,
pendulum, bell. But difficulty changes how many wrong guesses are allowed
(5, 6, or 8) — so how do 8 parts map onto, say, 5 allowed guesses?

`clockPartStage(partIndex, maxWrongGuesses)` scales the part's position
proportionally: `Math.ceil((partIndex + 1) * maxWrongGuesses / 8)`. On Hard
(5 allowed guesses), some parts end up appearing on the same wrong guess —
e.g. the pendulum and bell might both appear on wrong guess 5. The important
guarantee, which the tests in `gameLogic.test.ts` check directly, is that
**the bell (part index 7, the last one) always lands exactly on
`maxWrongGuesses`** — so however many misses a difficulty allows, the clock
always finishes and chimes on the guess that ends the game. Nothing about
difficulty changes _that_ — only how much of the clock has appeared before
that final guess.

If you ever add a 9th part (say, a second bell hand) or change
`CLOCK_PART_COUNT`, this scaling keeps working automatically — you don't
need to touch `clockPartStage` or the difficulty configs.

## Running it locally

```bash
yarn install
yarn dev        # http://localhost:3170
```

`yarn test` runs the unit/component tests (Vitest + Testing Library);
`yarn test:e2e` runs the Playwright browser tests in `e2e/` (install browsers
once first with `yarn playwright install`). `yarn lint`, `yarn
format:check`, and `yarn typecheck` are the same checks CI and the
pre-commit hook run.

## A few things that might surprise you

- **`guessLetter` never mutates.** If you're adding a feature and find
  yourself wanting to reach into `state.guessedLetters` and `.add()` to it
  directly, stop — copy it into a new `Set` first (see how `guessLetter`
  itself does this). The whole game logic layer relies on old and new state
  objects being distinct so React's `useState` setter triggers a re-render.
- **The keyboard listener only exists while a game is in progress.** Look at
  the `useEffect` in `App.tsx` — it's guarded by `if (!game) return;` and
  re-runs whenever `game` changes, so physical keyboard presses do nothing
  on the setup screen.
- **The PWA config is a separate file.** `vite-pwa.config.ts` (not
  `vite.config.ts`) holds the manifest and service-worker setup, imported
  into `vite.config.ts`'s `plugins` array. This mirrors how the `sudoku`
  sibling repo does it, so if you're jumping between the two, look there
  first.
- **Icons are generated, not hand-drawn in an app.** `public/icons/*.png`
  are rasterized from the SVGs in `design/` via `rsvg-convert` — see
  `design/README.md` for the exact commands. If you need to change the icon,
  edit the SVG source and re-rasterize rather than editing the PNGs
  directly.
