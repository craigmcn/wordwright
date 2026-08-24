# wordwright

A hangman-style word/phrase guessing game where each wrong guess builds one
piece of a clockwork wall clock; the completed clock chimes to end the game
on a loss. Built with React 19, Vite 8, TypeScript 6 (strict). Installable
as an offline-capable PWA via `vite-plugin-pwa`.

## Commands

```bash
yarn dev             # dev server (http://localhost:3170)
yarn build           # tsc -b + production build → dist/
yarn build:netlify   # dual build: netlify/ (root) + netlify/wordwright/ (GH Pages)
yarn test            # vitest watch mode
yarn test:coverage   # vitest run --coverage
yarn test:e2e        # Playwright headless E2E (run `yarn playwright install` once first)
yarn lint            # ESLint (src, e2e)
yarn format:check    # Prettier check
yarn typecheck       # tsc -b
```

## Architecture

- **Game logic:** `src/lib/gameLogic.ts` is a pure, framework-free reducer
  core — `createGame`, `guessLetter`, `getDisplayChars`, `getGuessableLetters`.
  `guessLetter` is a pure function (`GameState -> GameState`); `App.tsx`
  wraps it in `useState`. Random selection takes an injectable `random: ()
=> number` (defaults to `Math.random`) so tests can pin the outcome
  deterministically.
- **Difficulty:** `DIFFICULTIES` in `gameLogic.ts` maps `"easy" | "medium" |
"hard"` to a `maxWrongGuesses` budget (8 / 6 / 5 — 6 is the traditional
  hangman baseline). `data/entries.ts` tags each word/phrase with a matching
  `difficulty`, roughly blending length, letter variety, and how common the
  word is — not a strict formula. `filterEntries` narrows the pool by
  difficulty and by `ModeFilter` (`"word" | "phrase" | "either"`) before a
  game starts.
- **Clock mechanism:** `CLOCK_PART_COUNT` (8) is the fixed number of named
  visual parts (bracket, case, face, markers, hour hand, minute hand,
  pendulum, bell). `clockPartStage(partIndex, maxWrongGuesses)` scales those
  8 parts across however many wrong guesses the active difficulty allows, so
  the bell (the final part) always lands on the final allowed miss —
  the clock always finishes and chimes exactly on the losing guess,
  regardless of difficulty. `components/ClockMechanism.tsx` renders each
  part as an SVG `<g>` gated on that stage; `isChiming` (true once
  `status === "lost"`) triggers the shake/chime-ring CSS animations in
  `ClockMechanism.css`.
- **UI flow:** `App.tsx` owns two pieces of state: `difficulty`/`mode`
  (settings) and `game: GameState | null`. `game === null` renders
  `components/GameSetup.tsx`; otherwise renders the board (clock, word
  blanks, keyboard). Physical keyboard input is wired via a `keydown`
  listener in `App.tsx`, active only while a game is in progress.
- **Word list:** `src/data/entries.ts` — a small curated bank, not aiming
  for exhaustive coverage. Extend by adding entries with a `category`,
  `type` (`"word" | "phrase"`), and `difficulty`.
- **Theming:** `src/index.css` defines semantic CSS custom properties
  (`--bg`, `--text`, `--accent`, `--brass`, `--correct`, `--wrong`, etc.)
  with light defaults on `:root` and a `prefers-color-scheme: dark`
  override block; component CSS files consume only `var(--token)`
  references. Display font is "Baloo 2" (headings, letter tiles, buttons),
  body font is "Nunito" — both loaded via Google Fonts in `index.html`.
- **Responsive layout:** mobile-first, sized with `clamp()` rather than
  fixed breakpoints (see `App.css`, `Keyboard.css`, `WordDisplay.css`,
  `GameSetup.css`) so the board fits without horizontal scroll down to a
  ~320px viewport. Hover-only affordances are gated behind
  `@media (hover: hover) and (pointer: fine)` so a tap on touch devices
  doesn't leave a control looking "stuck" hovered.
  `WordDisplay.tsx` groups letters into per-word runs before rendering so
  `flex-wrap` only breaks a line between words, never mid-word — grouping
  by word, not by character, is what makes that guarantee hold.
- **Feedback on win/loss:** `src/lib/feedback.ts` — `playChimeRing()`
  synthesizes a short two-tone bell via the Web Audio API (no audio asset,
  so it works offline in the PWA); `vibrate()` wraps the Vibration API.
  Both no-op silently where unsupported (e.g. Safari has no Vibration
  API) rather than throwing. Wired into `GameBoard` in `App.tsx` via a
  `useEffect` keyed on `game.status`: a loss rings and vibrates a longer
  pattern, a win vibrates a single short pulse.
- **PWA / offline:** `vite-pwa.config.ts` (imported by `vite.config.ts`)
  configures `vite-plugin-pwa` — manifest, icons (`public/icons/`,
  rasterized from `design/*.svg` via `rsvg-convert`; see
  `design/README.md`), and a `generateSW` service worker that precaches the
  app shell plus Google Fonts (`CacheFirst`). This mirrors the `sudoku`
  repo's PWA setup
  (`vite-pwa.config.ts` shared between the plain `dist/` build and the
  `--outDir`/`--base` Netlify/GitHub-Pages dual build), adapted to
  wordwright's single-`vite.config.ts` + CLI-flag build script instead of
  separate config files per output.

## Testing notes

- `src/lib/gameLogic.test.ts` covers the reducer core and the clock-part
  scaling math directly (no rendering needed).
- `src/App.test.tsx` drives the setup screen and a full game via Testing
  Library; e2e (`e2e/gameplay.spec.ts`) covers the same flows against a real
  browser.
