# Agent guidance

## Project context

Read [ARCHITECTURE.md](ARCHITECTURE.md) before making architectural changes and
[README.md](README.md) for local setup. Architecture documentation is a snapshot;
check the current source and configuration when details differ.

BookMonkey (`angular-workshop-modern`) is an Angular 20.2 workshop application
written in strict TypeScript 5.9. It is a browser-rendered SPA using standalone
components, Angular Router, HttpClient, RxJS, and Zone-based change detection.
Tailwind CSS 4 provides most styling; Angular Material supplies snackbar support.
The backend is the external `bookmonkey-api` at `http://localhost:4730`.

## Structure and responsibilities

- `src/main.ts` bootstraps the app using `src/app/app.config.ts`.
- `src/app/app.*` defines the shell; `src/app/app.routes.ts` defines routes.
- `src/app/books/` contains the `Book` model, API client, list, item, and detail components.
- `BookApiClient` owns book HTTP requests. Keep endpoint and query construction here,
  rather than making HTTP requests directly in components.
- `BookListComponent` manages search and list loading; `BookItemComponent` renders
  a book card; `BookDetailComponent` handles individual book loading and error states.
- `src/app/shared/` holds reusable services such as `ToastService`.
- `src/styles.css` imports Tailwind; `src/material-theme.scss` contains Material overrides.
- `public/` holds static assets; `tests/` holds Playwright tests.

The collection route is `/`, details use `/books/:id`, and unknown routes redirect
to the collection. List requests use `/books` with `_limit` and optional `q`;
detail requests use `/books/:id`.

## Implementation conventions

- Keep components standalone and organize changes within the relevant feature.
- Preserve the separation between containers, presentation components, and data access.
- Follow the surrounding Angular patterns. Modernization to signals, `input()`,
  `inject()`, or built-in control flow should be deliberate and scoped to the task.
- Keep TypeScript and template checking strict; use the existing `Book` model and
  explicit types rather than introducing `any`.
- Keep asynchronous loading, empty, missing-record, and error states explicit.
  Clean up long-lived subscriptions and cancel obsolete requests where applicable.
- Use Tailwind utilities for layout and styling. Preserve responsive layouts,
  semantic markup, keyboard navigation, visible focus, and accessible status messages.
- Follow `.editorconfig` and `.prettierrc`: two spaces, single quotes, semicolons,
  no trailing commas, LF line endings, and a 120-character print width.
- SSR, NgRx SignalStore, and TanStack Query dependencies are installed for workshop
  exercises but are not active architecture. Introduce them only when the task calls for it.
- There is no repository backend, Azure infrastructure, or deployment pipeline.
  Do not assume these exist based on installed packages or workshop context.

## Local commands

Run commands from the repository root:

| Command                                                             | Purpose                                                 |
| ------------------------------------------------------------------- | ------------------------------------------------------- |
| `npm ci`                                                            | Install dependencies from the lockfile                  |
| `npx bookmonkey-api`                                                | Start the mock API on port 4730 in a separate terminal  |
| `npm start`                                                         | Start the Angular dev server at `http://localhost:4200` |
| `npm run build`                                                     | Build production output into `dist/`                    |
| `npm run watch`                                                     | Build continuously in development mode                  |
| `npm test -- --watch=false`                                         | Run the configured Karma unit-test target               |
| `npx playwright test`                                               | Run the Playwright suite across configured browsers     |
| `npx playwright test tests/book-details.spec.ts --project=chromium` | Run focused book-detail coverage                        |
| `npx prettier --check <changed-files>`                              | Check formatting of specific files                      |

Playwright starts the Angular dev server automatically and reuses an existing
server outside CI. The book-detail tests intercept API requests, so those tests
do not require a running mock API. `tests/example.spec.ts` targets playwright.dev;
passing that example does not validate BookMonkey. `tests-examples/` is outside
the configured test directory.

The unit-test target is configured, but no application unit specs are currently
present, and Karma/Jasmine dependencies are not declared in `package.json`.
Report tooling failures accurately rather than treating the target as verified.
`npm run format.write` formats all matching files under `src/` and does not cover
root Markdown; prefer targeted formatting to avoid unrelated edits.

## Validation and change scope

- Inspect the working tree before editing and preserve unrelated work.
- For application changes, run `npm run build` and the tests relevant to the changed
  behavior. For documentation-only changes, check content, paths, and formatting.
- Add meaningful regression coverage for behavior changes. Prefer deterministic
  API interception in browser tests and verify loading and failure paths where relevant.
- Respect the production bundle budgets in `angular.json`; investigate budget
  failures instead of increasing limits just to pass a build.
- Do not edit generated output in `dist/`, `.angular/`, `test-results/`, or
  `node_modules/`. Change dependencies and the lockfile only when needed by the task.
- Update `ARCHITECTURE.md` when changing architectural boundaries, routing, data
  flow, or setup. Treat its recommendations as possible improvements, not a mandate
  to refactor unrelated code.
- Finish by describing what changed, what was verified, and any remaining limitations.
