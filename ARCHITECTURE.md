# Architektur

## 1. Überblick

Dieses Repository enthält **BookMonkey** (Paketname `angular-workshop-modern`), eine kleine Angular-Single-Page-Application (SPA). Sie dient als Grundlage für den „Modern Angular Workshop" von workshops.de und zeigt eine durchsuchbare Bücherliste an, die von einer lokalen Fake-REST-API geladen wird.

> **Hinweis:** Obwohl das Projekt als „Azure"-Projekt bezeichnet wurde, enthält das Repository **keinerlei Azure-spezifischen Code, Konfiguration, Infrastructure-as-Code oder CI/CD**. Es handelt sich um ein reines Frontend-Projekt, das lokal gegen eine Mock-API läuft.

| Aspekt     | Wert                                                                                   |
| ---------- | -------------------------------------------------------------------------------------- |
| Typ        | Browser-SPA (Client-Side Rendering)                                                    |
| Framework  | Angular 20.2 (Standalone Components, keine NgModules)                                  |
| Sprache    | TypeScript 5.9 (`strict`, `strictTemplates`, Target ES2022)                            |
| Styling    | Tailwind CSS 4 + Angular-Material-20-Theme-Overrides                                   |
| Backend    | Keines im Repository – externe Mock-API `bookmonkey-api` unter `http://localhost:4730` |
| Build      | Angular CLI 20 mit `@angular/build:application` (esbuild/Vite)                         |
| Unit-Tests | Karma + Jasmine (konfiguriert, noch keine Specs vorhanden)                             |
| E2E-Tests  | Playwright (Chromium, Firefox, WebKit)                                                 |

## 2. Tech-Stack

### Laufzeit / Framework

- **Angular 20.2.1** (`core`, `common`, `compiler`, `forms`, `router`, `platform-browser`, `animations`)
- **RxJS 7.8** – `HttpClient` liefert `Observable`s
- **zone.js 0.15** – Zone-basierte Change Detection (`provideZoneChangeDetection({ eventCoalescing: true })`)
- **tslib**

### UI

- **Tailwind CSS 4.1.12** über `@tailwindcss/postcss` (siehe [.postcssrc.json](.postcssrc.json); `src/styles.css` enthält nur `@import 'tailwindcss'`). Die Komponenten werden direkt in den Templates mit Utility-Klassen gestaltet.
- **Angular Material 20 / CDK** – aktuell nur für `MatSnackBar` (über `ToastService`) sowie ein Theme-Override in `src/material-theme.scss` genutzt.
- Google Fonts (Roboto) und Material Icons werden in `src/index.html` per CDN geladen.

### Installiert, aber noch nicht verwendet (Workshop-Vorbereitung)

Commits wie „chore: install @angular/ssr / @ngrx/signals / ngrx-toolkit" zeigen, dass diese Pakete für spätere Workshop-Übungen vorbereitet sind. Im Code unter `src/` wird davon noch nichts importiert:

| Paket                                                 | Vorgesehener Zweck                                                                              |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `@angular/ssr`, `@angular/platform-server`, `express` | Server-Side Rendering (es gibt noch keine `server.ts` oder SSR-Konfiguration in `angular.json`) |
| `@ngrx/signals`, `@angular-architects/ngrx-toolkit`   | Signal-basiertes State Management (SignalStore)                                                 |
| `@tanstack/angular-query-experimental`                | Server-State / Datenabruf und Caching                                                           |

### Tooling

| Werkzeug                       | Version | Zweck                                                                                                          |
| ------------------------------ | ------- | -------------------------------------------------------------------------------------------------------------- |
| Angular CLI / `@angular/build` | 20.2.0  | Build, Dev-Server, Karma-Runner                                                                                |
| Prettier                       | 3.6.2   | Formatierung (120 Spalten, Single Quotes, keine Trailing Commas, `arrowParens: avoid`); `npm run format.write` |
| Playwright                     | ^1.55   | E2E-Tests; `webServer` startet `npm start` auf Port 4200                                                       |
| PostCSS                        | 8.5.6   | Tailwind-Pipeline                                                                                              |
| `.editorconfig`, `.vscode/`    | –       | Editor-Einstellungen, empfohlene Extensions (Angular Language Service, Prettier), Tasks/Launch-Konfigurationen |

### npm-Skripte

| Skript                 | Befehl                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------- |
| `npm start`            | `ng serve` (Development-Konfiguration, http://localhost:4200)                         |
| `npm run build`        | `ng build` (Production: Hashing, Budgets 500 kB Warnung / 1 MB Fehler)                |
| `npm run watch`        | `ng build --watch --configuration development`                                        |
| `npm test`             | `ng test` (Karma/Jasmine)                                                             |
| `npm run format.write` | Prettier über `src/**/*.{ts,html,md,css,json}`                                        |
| `npx bookmonkey-api`   | Startet die Mock-REST-API auf Port 4730 (keine Abhängigkeit, wird bei Bedarf geladen) |

## 3. Projektstruktur und Verantwortlichkeiten

- `src/main.ts` startet die Anwendung mit den Providern aus `src/app/app.config.ts`.
- `src/app/app.*` enth?lt die Anwendungsh?lle und `app.routes.ts` die Routen.
- `src/app/books/` enth?lt das Buchmodell, den API-Client, die Container f?r Liste und Details sowie die Darstellungskomponenten f?r Karten und Cover. Die umfangreichen Templates liegen in benachbarten HTML-Dateien.
- `src/app/shared/` enth?lt Fehlererfassung und den Snackbar-Wrapper `ToastService`.
- `tests/` enth?lt Playwright-Tests f?r Liste und Details.

## 4. Routing und Datenfluss

Die Routen f?hren ?ber `/` zur Liste und ?ber `/books/:id` zur Detailansicht; unbekannte Pfade werden auf die Liste umgeleitet. Beide Container verwenden einen lokalen diskriminierten Anfragezustand. Die Suche verz?gert nichtleere Eingaben um 300 ms, bricht ?ber `switchMap` veraltete Arbeit ab und setzt leere Eingaben sofort zur?ck. Wiederholungsversuche bleiben lokal. Auch beim Wechsel der Detail-ID werden veraltete Anfragen abgebrochen.

`BookApiClient` kapselt HTTP und erh?lt seine Basisadresse ?ber das Injection Token `BOOK_API_BASE_URL` (Standard: `http://localhost:4730`). Es kann durch einen Provider ?berschrieben werden. Der Client verwendet `/books` mit `_limit` und optional `q` sowie `/books/:id` f?r Details.

Erwartete 404-Antworten der Detailseite bleiben lokal; andere behandelte Anfragefehler werden einmal ?ber `ErrorReportingService` erfasst. Ein globaler ErrorHandler erfasst unerwartete unbehandelte Fehler ?ber denselben Service. Behebbare Fehler erscheinen auf der jeweiligen Seite; der Toast-Service bleibt f?r kurzzeitige Benachrichtigungen verf?gbar und zeigt keine zus?tzlichen Anfragefehler.

`BookCoverComponent` b?ndelt den Ersatz bei fehlenden oder defekten Bildern; die Aufrufer bestimmen die Bildgr??e.

### Buchvorschläge

Die Sammlung verlinkt auf `/book-suggestions`. Dort verwaltet die standalone `BookSuggestionComponent` ein Formular
mit den Pflichtfeldern Titel und Autor sowie den Zuständen bereit, sendend, erfolgreich und fehlgeschlagen.
`BookApiClient.submitSuggestion` sendet `{ title, author }` per `POST /book-suggestions` an dieselbe konfigurierte
API-Basisadresse. Vorschläge bleiben bis zur Prüfung von `/books` getrennt; das Formular schreibt nicht in die Sammlung.
Erfolg wird erst nach einer erfolgreichen Serverantwort angezeigt. Während des Versands sind weitere Eingaben und
Übermittlungen gesperrt; bei Fehlern bleiben die Eingaben für einen erneuten Versuch erhalten. Anfragefehler werden
über `ErrorReportingService` erfasst, beim Verlassen wird die laufende Anfrage abgebrochen.
Die Playwright-Suite `tests/book-suggestions.spec.ts` prüft Versand, Pflichtfelder, Ladezustand und Serverfehler mit
abgefangenen API-Anfragen. Der externe Backend-Dienst muss `/book-suggestions` unterstützen; dieses Repository ergänzt
keine Backend-Implementierung oder Prüfung von Vorschlägen.

## 5. Build, Tests und Betrieb

- Entwicklung: `npm install`, `npx bookmonkey-api` und `npm start` starten die lokale API und die Anwendung.
- `npm run build` erstellt den Browser-Build unter `dist/`. Die Bundle-Budgets stehen in `angular.json`.
- `npx playwright test` startet den Entwicklungsserver und testet die Anwendung mit abgefangenen API-Anfragen. Die Konfiguration sieht Chromium, Firefox und WebKit vor.
- Das Karma-Ziel enth?lt derzeit keine Anwendungstests; Karma- und Jasmine-Abh?ngigkeiten sind nicht deklariert.
- Deployment, Backend und Infrastruktur sind nicht Bestandteil dieses Repositorys.

## 6. Angular modernization

The application remains on Angular 20 and keeps Zone-based change detection. All components use
OnPush; local request states and component inputs use signals. Templates use built-in control flow
and track list entries by book ID. Services use `inject()`, and each feature route loads its component
lazily. The API client remains the only HTTP boundary.

Search and suggestions use typed, non-nullable reactive forms. Search retains its 300 ms debounce,
immediate clearing, and cancellation of obsolete requests. Suggestions disable both their form model
and fieldset during submission, retain values after failure, and cancel requests when destroyed.
The cover component resets its failure signal whenever its source changes. Covers are dynamic API
images (including data URLs), so they retain native image bindings.
