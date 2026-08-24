# Wordwright

[![Test](https://github.com/craigmcn/wordwright/actions/workflows/test.yml/badge.svg)](https://github.com/craigmcn/wordwright/actions/workflows/test.yml)
[![License: GPL v3 or later](https://img.shields.io/badge/License-GPL--3.0--or--later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Node](https://img.shields.io/badge/node-v24-brightgreen?logo=node.js&logoColor=white)](https://nodejs.org)
[![Yarn](https://img.shields.io/badge/yarn-4.14.1-2C8EBB?logo=yarn&logoColor=white)](https://yarnpkg.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Vitest](https://img.shields.io/badge/tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev)
[![Playwright](https://img.shields.io/badge/e2e-Playwright-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev)
[![PWA Ready](https://img.shields.io/badge/PWA-ready-5A0FC8)](https://web.dev/progressive-web-apps/)
[![ESLint](https://img.shields.io/badge/linted_with-ESLint-4B32C3?logo=eslint&logoColor=white)](https://eslint.org)
[![Code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io)
[![Open Issues](https://img.shields.io/github/issues/craigmcn/wordwright)](https://github.com/craigmcn/wordwright/issues)
[![Open PRs](https://img.shields.io/github/issues-pr/craigmcn/wordwright)](https://github.com/craigmcn/wordwright/pulls)
[![Last Commit](https://img.shields.io/github/last-commit/craigmcn/wordwright)](https://github.com/craigmcn/wordwright/commits/main)
[![Repo Size](https://img.shields.io/github/repo-size/craigmcn/wordwright)](https://github.com/craigmcn/wordwright)
[![Top Language](https://img.shields.io/github/languages/top/craigmcn/wordwright)](https://github.com/craigmcn/wordwright)

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
