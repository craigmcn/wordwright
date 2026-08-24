# Wordwright

A hangman-style word and phrase guessing game. Instead of a stick figure on
gallows, each wrong guess adds a piece to a clockwork wall clock. Once the
clock is fully built, it chimes and the game is over.

Play it in your browser — no install required, though it also installs as an
offline-capable PWA (add to home screen / install from the browser menu).

## Playing

1. Pick a difficulty (Easy / Medium / Hard) and whether you want single
   words, short phrases, or either.
2. Guess letters by clicking the on-screen keyboard or typing on a physical
   keyboard.
3. Each wrong guess adds a part to the clock. Guess every letter before the
   clock finishes and chimes.

## Development

```bash
yarn install
yarn dev              # dev server (http://localhost:3170)
```

Other commands:

```bash
yarn build             # tsc -b + production build → dist/
yarn build:netlify     # dual build: netlify/ (root) + netlify/wordwright/ (GH Pages)
yarn test              # vitest watch mode
yarn test:coverage     # vitest run --coverage
yarn test:e2e          # Playwright headless E2E (run `yarn playwright install` once first)
yarn lint               # ESLint (src, e2e)
yarn format:check      # Prettier check
yarn typecheck         # tsc -b
```

Requires Node (see `.node-version`) and Yarn 4 via Corepack (`corepack
enable`).

See [CLAUDE.md](CLAUDE.md) for architecture notes and
[doc/ONBOARDING.md](doc/ONBOARDING.md) for a guided walkthrough of the
codebase.
