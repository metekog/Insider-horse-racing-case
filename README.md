# Insider Horse Racing

Small Vue 3 + Vuex playground that runs six horse races, shows the current lap on the track, and keeps the program/results panels updated as the simulation progresses.

Live here: [https://563eb3dc.insider-horse-racing-case.pages.dev/](https://563eb3dc.insider-horse-racing-case.pages.dev/)

## Features

- Generates twenty unique horses (color + condition) and places them across six laps.
- Each lap animates from the far left so restarts look clean.
- Program and results panels update as soon as a lap is finished.
- Store logic is covered with unit tests; the main user flow is checked end to end with Playwright.

## Getting started

```bash
npm install
npm run dev
```

Vite prints the local address (defaults to `http://localhost:5173`). Open it in a browser to try the app.

## Testing

| Command            | Purpose                                               |
| ------------------ | ----------------------------------------------------- |
| `npm test`         | Runs Node-based unit tests in `tests/`.               |
| `npm run test:e2e` | Launches Playwright specs in `e2e/` on port `4173`.   |

Playwright needs browser binaries once: `npx playwright install`. Ensure port `4173` is free.

## Build

```bash
npm run build   # outputs to dist/
npm run preview # serves the production bundle locally
```

## Stack

- Vue 3 + Vite SPA
- Vuex 4 for horse/race state
- Node test runner + Playwright for automation

## Structure

```
src/
├─ components/
├─ store/
├─ assets/
tests/
e2e/
```

Use it as a reference or tweak it for your own demos. No extra tooling required beyond what is documented above.
