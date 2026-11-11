# Anwendungsweites Refactoring-Review

## Umfang und Bewertungsgrundlage

Diese Bewertung umfasst die gesamte aktive BookMonkey-Anwendung: Bootstrap und Anwendungshülle, Routing,
Buchmodell und API-Zugriff, Anfragezustände und Suche, Fehlerbehandlung, Darstellung, Barrierefreiheit,
Styling, Build-Konfiguration, Tests und Projektdokumentation. Geprüft wurden die Dateien unter `src/` und
`tests/` sowie `package.json`, `angular.json`, `playwright.config.ts`, die TypeScript-Konfiguration,
`.prettierrc`, `README.md`, `ARCHITECTURE.md` und `Agents.md`.

**Prüfstand:** 2026-11-10T09:33:07+01:00, Zeitzone `Europe/Berlin`.
**Referenz-Commit:** `3aab1a4b0e82d4fb04de5095251c1412cc2c2f38` plus der vorhandene, nicht vollständig
versionierte Arbeitsstand. Der Commit allein bildet die geprüfte Implementierung deshalb nicht ab.
Die vorhandenen lokalen Änderungen gehören zur Bewertungsgrundlage; sie wurden für dieses Review nicht umgesetzt.

Diese Aktualisierung ändert ausschließlich `REFACTORING.md`. Alle folgenden Maßnahmen sind Bewertungen oder
Empfehlungen; Anwendungscode, Tests, Konfiguration und andere Dokumente werden dadurch nicht geändert.
Es handelt sich überwiegend um eine statische Prüfung. Vorhandene Testfälle belegen die Testabsicht,
keinen erfolgreichen Testlauf. Frühere Formulierungen zu inzwischen behobenen Problemen werden durch den
unten beschriebenen Istzustand ersetzt.

## Statusregeln und Nachprüfung

| Status                              | Bedeutung                                                                               |
| ----------------------------------- | --------------------------------------------------------------------------------------- |
| Offen                               | Die Maßnahme ist noch nicht umgesetzt oder die benötigte Absicherung fehlt vollständig. |
| Teilweise umgesetzt                 | Wesentliche Teile sind vorhanden; konkrete Restarbeiten sind benannt.                   |
| Umgesetzt – Verifikation ausstehend | Die Implementierung ist vorhanden; erforderliche Build- oder Laufzeitnachweise fehlen.  |
| Abgeschlossen                       | Die genannten Abnahmekriterien sind durch die dokumentierte Prüfart erfüllt.            |

Ein statisch abnehmbarer Strukturpunkt kann abgeschlossen sein, ohne dass damit die Laufzeitfunktion der
Anwendung bestätigt wird. Bei Verhaltensänderungen sind passende erfolgreiche Tests erforderlich.
Unbekannte historische Umsetzungs- und Abschlusszeitpunkte werden nicht nachträglich erfunden.
„Abgeschlossen“ bezeichnet hier das bestätigte Prüfergebnis zum angegebenen Zeitpunkt, kein bekanntes früheres
Implementierungsdatum.

- Jeder Punkt erhält eine stabile Kennung. RF-001 bis RF-007 entsprechen den bisherigen sieben Punkten.
- Die Übersicht enthält je Punkt letzte Prüfung, Prüfart und nächste Prüffälligkeit. Zeitstempel verwenden
  ISO 8601 mit dem für `Europe/Berlin` geltenden Offset.
- Das Intervall beträgt 30 Kalendertage ab der letzten Prüfung, jeweils zur gleichen lokalen Uhrzeit;
  bei einem Wechsel der Sommerzeit ist der Offset anzupassen.
- Änderungen an den genannten Fundstellen, relevanten Abhängigkeiten oder Tests erfordern eine frühere
  Nachprüfung. Ein alter Abschluss gilt nicht automatisch für geänderten Code.
- Fälligkeit und Umsetzungsstatus werden getrennt geführt. Nach Überschreiten der Fälligkeit lautet der
  Aktualitätsvermerk „Nachprüfung fällig“; der letzte belegte Umsetzungsstatus bleibt nachvollziehbar.
- Zeitstempel erst nach tatsächlicher Nachprüfung fortschreiben. Ohne neue Nachweise bleibt eine ausstehende
  Verifikation bestehen. Bei Regressionen den Status zurücksetzen und den Grund protokollieren.
- Das Prüfprotokoll unten fortlaufend ergänzen und alte Einträge erhalten. Diese Datei richtet keine
  automatische Prüfung, Erinnerung oder Hintergrundaufgabe ein.

## Statusübersicht

Zum Prüfstand: **1 abgeschlossen**, **4 umgesetzt mit ausstehender Verifikation**, **3 teilweise umgesetzt**,
**5 offen**. Alle Punkte sind zum Prüfstand innerhalb des Intervalls. Historische Abschlusszeitpunkte sind unbekannt.

| Kennung | Thema                                             | Priorität | Status                              | Letzte Prüfung            | Prüfart                        | Nächste Prüfung           |
| ------- | ------------------------------------------------- | --------- | ----------------------------------- | ------------------------- | ------------------------------ | ------------------------- |
| RF-001  | Anfragezustand der Detailseite                    | Hoch      | Umgesetzt – Verifikation ausstehend | 2026-11-10T09:33:07+01:00 | Code und Testquellen statisch  | 2026-12-10T09:33:07+01:00 |
| RF-002  | Einheitliche Fehlerbehandlung                     | Hoch      | Umgesetzt – Verifikation ausstehend | 2026-11-10T09:33:07+01:00 | Code und Testquellen statisch  | 2026-12-10T09:33:07+01:00 |
| RF-003  | Umfangreiche Templates auslagern                  | Mittel    | Abgeschlossen                       | 2026-11-10T09:33:07+01:00 | Statische Strukturprüfung      | 2026-12-10T09:33:07+01:00 |
| RF-004  | Gemeinsames Cover-Verhalten                       | Mittel    | Teilweise umgesetzt                 | 2026-11-10T09:33:07+01:00 | Code und Testquellen statisch  | 2026-12-10T09:33:07+01:00 |
| RF-005  | Asynchrone Listensuche                            | Hoch      | Umgesetzt – Verifikation ausstehend | 2026-11-10T09:33:07+01:00 | Code und Testquellen statisch  | 2026-12-10T09:33:07+01:00 |
| RF-006  | Konfigurierbare API-Adresse                       | Mittel    | Umgesetzt – Verifikation ausstehend | 2026-11-10T09:33:07+01:00 | Statische Datenflussprüfung    | 2026-12-10T09:33:07+01:00 |
| RF-007  | Regressionstests für Zustandswechsel              | Mittel    | Teilweise umgesetzt                 | 2026-11-10T09:33:07+01:00 | Statische Testprüfung          | 2026-12-10T09:33:07+01:00 |
| RF-008  | Fokus, Seitenstruktur und Navigation              | Hoch      | Offen                               | 2026-11-10T09:33:07+01:00 | Statische Templateprüfung      | 2026-12-10T09:33:07+01:00 |
| RF-009  | Ausführbares Unit-Testziel                        | Mittel    | Offen                               | 2026-11-10T09:33:07+01:00 | Konfiguration und Dateibestand | 2026-12-10T09:33:07+01:00 |
| RF-010  | Gemeinsame Testkonfiguration und Testdaten        | Mittel    | Offen                               | 2026-11-10T09:33:07+01:00 | Statische Testprüfung          | 2026-12-10T09:33:07+01:00 |
| RF-011  | Verlässliche Projektdokumentation                 | Mittel    | Teilweise umgesetzt                 | 2026-11-10T09:33:07+01:00 | Inhalts- und Pfadprüfung       | 2026-12-10T09:33:07+01:00 |
| RF-012  | Ungenutzten Zustand der Anwendungshülle entfernen | Niedrig   | Offen                               | 2026-11-10T09:33:07+01:00 | Statische Referenzprüfung      | 2026-12-10T09:33:07+01:00 |
| RF-013  | Externe Schrift- und Icon-Ressourcen prüfen       | Niedrig   | Offen                               | 2026-11-10T09:33:07+01:00 | Statische Ressourcenprüfung    | 2026-12-10T09:33:07+01:00 |

## Bestehende Refactoring-Punkte

### RF-001 – Anfragezustand der Detailseite

**Fundstellen:** `src/app/books/book-detail.component.ts`, `src/app/books/book-detail.component.html`,
`tests/book-details.spec.ts`.

**Istzustand:** Die früheren vier unabhängigen Zustandsfelder sind durch `BookDetailState` mit den Varianten
`loading`, `loaded`, `not-found` und `error` ersetzt. `switchMap` wechselt bei neuer ID oder Wiederholung die
Anfrage; `catchError` bleibt innerhalb der Anfrage. `takeUntilDestroyed` bindet die Subscription an den
Komponentenlebenszyklus. Das Template prüft die Zustandsvarianten; widersprüchliche Flag-Kombinationen entfallen.

**Restarbeit und Abnahme:** Implementierung kann nach erfolgreichem Build und bestandenen Tests für verzögertes
Laden, Erfolg, 404, Server-/Netzwerkfehler, Wiederholung und ID-Wechsel als abgeschlossen gelten. Die passenden
Detailtests sind vorhanden; ihr erfolgreicher Lauf ist hier nicht nachgewiesen. Kein globaler Store erforderlich.

### RF-002 – Einheitliche Fehlerbehandlung

**Fundstellen:** `src/app/shared/error-reporting.service.ts`, `src/app/app.config.ts`,
`src/app/books/book-list.component.ts`, `src/app/books/book-detail.component.ts` und zugehörige Templates.

**Istzustand:** Beide Container besitzen ausdrückliche Fehlerzustände und lokale Wiederholung. Detail-404 bleibt
lokal; andere behandelte Anfragefehler gehen an `ErrorReportingService`. `GlobalErrorHandler` ist als
`ErrorHandler` registriert und nutzt denselben Service. Der Service protokolliert derzeit über `console.error`.
Der Toast-Service erzeugt keine zusätzlichen Anfragehinweise. Der Detailcode grenzt `unknown` mit
`HttpErrorResponse` ein, bevor er `status` liest.

**Restarbeit und Abnahme:** Prüfen, dass ein fehlgeschlagener Listenaufruf keine Leerzustandsmeldung zeigt,
Wiederholung funktioniert, erwartete Detail-404 nicht gemeldet werden und jeder behandelte unerwartete
Anfragefehler genau einmal gemeldet wird. Den globalen Handler separat testen. Vorhandene Browsertests decken
sichtbare Fehler und Wiederholung ab, aber nicht die gesamte Meldekette. Gemeinsame Klassifizierung oder
Interceptor nur bei tatsächlichem zusätzlichem Bedarf einführen; kein pauschales automatisches Retry.

### RF-003 – Umfangreiche Templates auslagern

**Fundstellen:** `src/app/books/book-detail.component.ts`, `src/app/books/book-list.component.ts`,
`src/app/books/book-item.component.ts` und ihre jeweils benachbarten `.html`-Dateien.

**Istzustand und Abschlussnachweis:** Alle drei Komponenten verwenden `templateUrl`; die zugehörigen
HTML-Dateien existieren. Anfrage- und Routensteuerung bleiben in den Containern, die Karte enthält keine
HTTP-Anfragen. Damit ist das strukturelle Abnahmekriterium dieses Punkts statisch erfüllt: **Abgeschlossen**.
Der historische Zeitpunkt der Template-Auslagerung ist unbekannt.

**Grenze des Nachweises:** Dieser Abschluss bestätigt die Struktur, keine erfolgreiche Build-, Formatierungs-
oder Darstellungsprüfung der Anwendung. Layout und Tastaturnavigation bleiben Teil von RF-007 und RF-008.
Das kurze Cover-Template muss allein wegen seiner Inline-Form nicht ebenfalls ausgelagert werden.

### RF-004 – Gemeinsames Cover-Verhalten

**Fundstellen:** `src/app/books/book-cover.component.ts`, Karten- und Detail-Templates sowie beide Browsertestdateien.

**Istzustand:** Karte und Detailseite verwenden `BookCoverComponent`. Fehlende Quellen und Bildladefehler führen
zur gemeinsamen Ersatzdarstellung. Die Aufrufer bestimmen die Größe. Browsertests für defekte Bilder sind
für beide Ansichten vorhanden; ein fehlendes Cover wird im Detailtest ausdrücklich geprüft.

**Restarbeit:** `ngOnChanges()` setzt `failed` bei jeder Input-Änderung zurück, auch bei unveränderter Quelle.
Dadurch kann eine reine Alternativtext- oder Klassenänderung ein bereits defektes Bild erneut aktivieren.
Den Fehlerzustand gezielt bei Änderung von `src` zurücksetzen.

**Abnahme:** Fehlende und defekte Quellen zeigen den Ersatz. Ein Wechsel zu einer gültigen Quelle ermöglicht
wieder ein Bild. Änderungen nur an `alt` oder `imageClass` heben den Fehlerzustand nicht auf. Verhalten in
gezielten Komponententests und Darstellung in Karte und Detailseite nachweisen.

### RF-005 – Asynchrone Listensuche

**Fundstellen:** `src/app/books/book-list.component.ts`, `src/app/books/book-list.component.html`,
`tests/book-list.spec.ts`.

**Istzustand:** Der manuelle `any`-Timer ist entfernt. Ein Stream kombiniert Suchänderungen und Wiederholungen;
`distinctUntilChanged` unterdrückt wiederholte Suchwerte, `timer(300)` verzögert nichtleere Eingaben.
Der äußere `switchMap` beendet ausstehende Verzögerungen und alte Anfragen. Leere Eingaben starten ohne
Verzögerung. Ein lokales Zustandsmodell und `takeUntilDestroyed` sind vorhanden.

**Restarbeit und Abnahme:** Erfolgreich nachweisen, dass alte Antworten neue Ergebnisse nicht überschreiben,
Leeren eine ausstehende Suche verwirft, doppelte Suchwerte keine zusätzliche Suchanfrage erzeugen und
Lade-, Leer- und Fehlerzustände korrekt sind. Bestehende Tests prüfen bereits Teile von Anfragewechsel,
Leeren und Fehler/Wiederholung. Die ergänzende Absicherung gehört zu RF-007.

### RF-006 – Konfigurierbare API-Adresse

**Fundstellen:** `src/app/books/book-api-client.service.ts`, `src/app/books/book.ts`, `ARCHITECTURE.md`.

**Istzustand:** `BOOK_API_BASE_URL` bietet einen injizierbaren Standardwert `http://localhost:4730`.
`BookApiClient` entfernt einen abschließenden Schrägstrich, ergänzt `/books`, baut `_limit` und optional `q`
über `HttpParams` auf und kodiert Detail-IDs mit `encodeURIComponent`. Die Ergebnisse sind mit `Book` typisiert.
HTTP-Zugriffe bleiben im Client. Die Basisadresse kann per Provider überschrieben werden.

**Restarbeit und Abnahme:** Mit HTTP-Client-Tests eine überschriebene Basisadresse mit und ohne abschließenden
Schrägstrich, Suchparameter, `_limit` und die Kodierung von IDs nachweisen. Die vorhandenen Browsertests
verwenden weiterhin die Standardadresse und belegen die Überschreibbarkeit nicht. Deployment-Konfiguration
nur bei konkretem Bedarf ergänzen; Backend und SSR sind hierfür nicht notwendig.

### RF-007 – Regressionstests für Zustandswechsel

**Fundstellen:** `tests/book-details.spec.ts`, `tests/book-list.spec.ts`, `playwright.config.ts`.

**Istzustand:** Detailtests für Tastaturnavigation, direkte URLs, zwei Bildschirmbreiten, Ladezustand, fehlende
und defekte Cover, 404 und Wiederholung sind vorhanden. Ergänzt sind ein ID-Wechsel während einer laufenden
Detailanfrage und Such-/Leerszenarien. Das externe Beispiel `tests/example.spec.ts` ist im Arbeitsstand entfernt;
`tests-examples/` liegt außerhalb des konfigurierten Testverzeichnisses.

**Restarbeit:** Die Tests für veraltete Antworten prüfen direkt nach Freigabe der alten Antwort erneut den
Bildschirm. Ohne ausdrückliche Synchronisation mit der Verarbeitung beziehungsweise dem belegten Abbruch
kann diese Prüfung zu früh erfolgen. Auch die Wiederverwendung der Detailkomponente ist nicht ausdrücklich
belegt. Leere Sammlung, leeres Suchergebnis, Fehler nach erfolgreicher Suche und unbekannte Routen fehlen.

**Abnahme:** Diese Fälle deterministisch mit abgefangenen API-Anfragen absichern. Bei Anfragewechseln sowohl
den Start der alten Anfrage als auch den verarbeiteten Wechsel und das Ausbleiben einer Überschreibung
nachweisen; Komponentenwiederverwendung gezielt absichern. Die Suite muss in Chromium, Firefox und WebKit
bestehen. Vorhandene Tests allein gelten nicht als bestandene Regressionstests.

## Zusätzliche anwendungsweite Empfehlungen

### RF-008 – Sichtbaren Fokus und nachvollziehbare Seitenstruktur herstellen

**Fundstellen:** `src/app/app.html`, `src/app/books/book-list.component.html`,
`src/app/books/book-detail.component.html`, `src/app/books/book-item.component.html`.

**Befund:** Das Suchfeld entfernt mit `focus:outline-none` den Standardfokus, ohne einen Ersatz zu definieren.
Die Hülle und die gerenderte Listen- beziehungsweise Detailseite verwenden jeweils `h1`. Ein Sprunglink zum
Hauptinhalt fehlt. Karten besitzen dagegen einen sichtbaren Fokus und ein zugängliches Linklabel.

**Empfehlung und Abnahme:** Einen sichtbaren Suchfokus und nachvollziehbare Fokusdarstellung aller
Bedienelemente herstellen. Eine eindeutige Hauptüberschrift pro Seite und passende Unterüberschriften wählen.
Einen per Tastatur erreichbaren Sprunglink zum Hauptinhalt ergänzen. Bestehende semantische Links sowie
`role="status"` und `role="alert"` erhalten. Tastaturnavigation, Fokus und mobile/weite Darstellung prüfen;
die bestehende Kartenprüfung beibehalten. Die mehreren `h1` sind eine Strukturverbesserung, kein hier
nachgewiesener vollständiger Barrierefreiheitsbefund.

### RF-009 – Das konfigurierte Unit-Testziel ausführbar machen

**Fundstellen:** `package.json`, `angular.json`, `tsconfig.spec.json`; unter `src/` fehlen Anwendungsspecs.

**Befund:** `npm test` verweist auf das Karma-Ziel, und die Spec-Konfiguration erwartet Jasmine-Typen.
Die benötigten Karma-/Jasmine-Abhängigkeiten sind nicht in `package.json` deklariert. Ein erfolgreicher
Unit-Testlauf ist damit nicht belegt.

**Empfehlung und Abnahme:** Das bestehende Ziel mit passenden Entwicklungsabhängigkeiten vervollständigen,
die Lockdatei gezielt aktualisieren und sinnvolle Tests für API-Konfiguration, Fehlererfassung und Cover
ergänzen. `npm test -- --watch=false` muss mit tatsächlichen Anwendungstests erfolgreich durchlaufen.
Keine Testframework-Migration allein zur Behebung der fehlenden Einrichtung.

### RF-010 – Testkonfiguration und Testdaten bündeln

**Fundstellen:** `playwright.config.ts`, `tests/book-details.spec.ts`, `tests/book-list.spec.ts`.

**Befund:** Die Anwendungsadresse wird in Tests wiederholt; `use.baseURL` ist nicht gesetzt.
API-Adressen und Buch-Testdaten werden separat definiert. Die Testdaten besitzen keine ausdrückliche
Bindung an das vorhandene `Book`-Modell.

**Empfehlung und Abnahme:** `baseURL` für relative Seitenaufrufe verwenden und API-Testadresse sowie gemeinsame
Buch-Testdaten in kleinen Testhilfen bündeln. Beispielsweise `satisfies Book` zur Modellprüfung einsetzen;
falls erforderlich eine typisierte Funktion für Varianten ergänzen. Playwrights Serveradresse und Basis-URL
müssen zusammenpassen. Tests müssen weiterhin unabhängig voneinander und ohne laufende Mock-API funktionieren.
Keine produktive API-Konfiguration allein für Testhilfen in Browsertests importieren.

### RF-011 – Projektdokumentation lesbar und konsistent halten

**Fundstellen:** `ARCHITECTURE.md`, `README.md`, `Agents.md` und diese Datei.

**Istzustand:** Die Architektur beschreibt bereits Detailroute, lokale Zustandsmodelle, API-Token,
Cover-Komponente und gemeinsame Fehlererfassung. In mehreren neueren Abschnitten stehen jedoch tatsächlich
Fragezeichen statt Umlauten, etwa „enth?lt“ oder „f?r“. Das README beschreibt nur einen Teil der vorhandenen
Entwicklungs- und Prüfkommandos.

**Empfehlung und Abnahme:** Beschädigte Zeichen anhand des Inhalts korrigieren, lesbares UTF-8 und die
vereinbarten Zeilenenden verwenden. Setup- und Testanleitungen mit den tatsächlichen Skripten und
Tooling-Grenzen abgleichen. Architektur und aktiven Code erneut vergleichen. Links und Befehle müssen
stimmen; fehlende Unit-Testwerkzeuge bis zur Behebung ausdrücklich nennen. Änderungen an diesen anderen
Dokumenten sind nicht Teil der vorliegenden Aktualisierung.

### RF-012 – Ungenutzten Zustand der Anwendungshülle entfernen

**Fundstellen:** `src/app/app.ts`, `src/app/app.html`.

**Befund:** Das Feld `protected title = 'BookMonkey'` wird vom Template nicht verwendet; der sichtbare
Anwendungsname steht direkt im HTML.

**Empfehlung und Abnahme:** Das ungenutzte Feld entfernen. Nur bei einem tatsächlichen Bedarf an einem
veränderlichen Namen stattdessen eine gemeinsame Quelle einführen. Referenzprüfung und Build müssen
bestätigen, dass die Hülle ohne das Feld funktioniert. Kein Architekturumbau für diese kleine Bereinigung.

### RF-013 – Externe Schrift- und Icon-Ressourcen am tatsächlichen Bedarf ausrichten

**Fundstellen:** `src/index.html`, `src/styles.css`, `src/material-theme.scss` und Templates unter `src/app/`.

**Befund:** `src/index.html` bindet Roboto und Material Icons von Google Fonts ein. Die aktiven Templates
verwenden SVG-Icons; eine ausdrückliche Nutzung der Material-Icons-Schrift oder der Roboto-Schrift ist im
Anwendungscode nicht vorhanden. Der tatsächliche visuelle Nutzen der Einbindungen ist nicht nachgewiesen.

**Empfehlung und Abnahme:** Die effektiven Schriftarten und die Snackbar-Darstellung im Browser prüfen.
Nicht benötigte externe Einbindungen entfernen oder ihren konkreten Bedarf dokumentieren. Darstellung und
Funktion müssen auch bei blockierten externen Schriftressourcen brauchbar bleiben. Material-Theme und der
vorbereitete Toast-Service werden nicht pauschal entfernt. Dies ist eine Empfehlung zur Ressourcenpflege,
keine hier nachgewiesene Sicherheits- oder Datenschutzverletzung.

## Beizubehaltende Architektur und bewusste Grenzen

- Komponenten bleiben standalone; Container, Darstellung und HTTP-Zugriff sind getrennt. `Book` und die
  strenge TypeScript-/Template-Prüfung bleiben die Grundlage.
- `/` zeigt die Sammlung, `/books/:id` die Details; unbekannte Routen werden auf die Sammlung umgeleitet.
  Die kleine Anwendung benötigt für diese Maßnahmen keinen Routing-Umbau. RF-007 ergänzt den Verhaltensnachweis.
- Konstruktorinjektion ist kein Mangel. Die Konstruktoren führen keine HTTP-Anfragen aus; die Ableitung
  der Client-URL im Konstruktor ist eine lokale Initialisierung.
- Lifecycle-Bereinigung, Abbruch veralteter Anfragen, lokale Wiederholung und die Unterscheidung zwischen
  fehlendem Datensatz und anderen Fehlern sind zu erhalten.
- Tailwind bleibt für Layout zuständig; das Material-Theme und der vorbereitete Toast-Service bleiben bestehen.
- SSR-, Store- und Query-Pakete sowie Express sind Workshop-Vorbereitung. Ihre bloße Installation begründet
  weder eine Einführung dieser Architektur noch eine automatische Entfernung der Pakete.
- Zone-basierte Änderungserkennung bleibt bestehen. Signale, `inject()` oder neue Kontrollflusssyntax sind
  kein Selbstzweck und werden nicht als pauschales anwendungsweites Refactoring gefordert.
- Produktionsbudgets bleiben unverändert: initial 500 kB Warnung/1 MB Fehler, Komponentenstile 4 kB/8 kB.
  Budgetüberschreitungen müssen untersucht werden; höhere Limits sind kein Ersatz für eine Lösung.
- Es gibt kein Repository-Backend und keine nachgewiesene Deployment- oder Azure-Infrastruktur.
  Backend, Pipeline und geplanter Betrieb sind nicht Gegenstand dieses Reviews.

## Prüfverfahren und empfohlene Reihenfolge

1. RF-008 und den verbleibenden Cover-Fehler aus RF-004 beheben; Strukturabschluss RF-003 beibehalten.
2. RF-009 und RF-010 umsetzen und die fehlenden Fälle aus RF-007 ergänzen.
3. RF-001, RF-002, RF-005 und RF-006 anhand erfolgreicher Verhaltensprüfungen abnehmen.
4. Dokumentation und kleinere Bereinigungen RF-011 bis RF-013 bearbeiten und erneut prüfen.

Für eine spätere Umsetzung sind `npm run build`, `npm test -- --watch=false`, `npx playwright test` und
gezielte Prettier-Prüfungen relevant. HTTP-Tests dürfen deterministisch abfangen; die Browsertests benötigen
keine laufende Mock-API. Ein erfolgreicher Beispieltest einer fremden Website wäre kein BookMonkey-Nachweis.
Nach Template-/Fokusänderungen mobile und Desktop-Darstellung sowie Tastaturnavigation prüfen.

**Bekannte Prüfgrenze:** Ein früherer Buildversuch innerhalb dieser Sitzung mit `npm run build` brach mit
`spawn EPERM` ab. Das ist ein fehlender Buildnachweis und kein belegter fachlicher Anwendungsfehler.
Der genaue historische Ausführungszeitpunkt ist nicht erfasst. In dieser Dokumentationsaktualisierung wurden
Build, Unit-Tests und Browsertests nicht erneut ausgeführt. Es werden deshalb keine erfolgreichen
Anwendungsprüfungen behauptet. Ausführungsbeschränkungen bei einer späteren Nachprüfung separat dokumentieren.

## Fortlaufendes Prüfprotokoll

| Prüfzeitpunkt             | Umfang und Ergebnis                                                                                                                                         | Nachweis und Grenzen                                                                                                                                                           | Nächste reguläre Prüfung  |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| 2026-11-10T09:33:07+01:00 | Erste anwendungsweite Neubewertung; RF-001 bis RF-007 erhalten, RF-008 bis RF-013 ergänzt. RF-003 strukturell abgeschlossen; übrige Status gemäß Übersicht. | Statische Quell-, Konfigurations- und Testprüfung am lokalen Arbeitsstand. Früherer Buildabbruch `spawn EPERM` berücksichtigt; keine erfolgreichen Laufzeittests nachgewiesen. | 2026-12-10T09:33:07+01:00 |

Bei weiteren Prüfungen hier neue Zeilen ergänzen: betroffene Kennungen, tatsächlich ausgeführte Befehle oder
statische Prüfschritte, Ergebnis, Statusänderungen und neue Fälligkeit festhalten. Bei erfolgreichen
Verhaltensprüfungen auch Browser beziehungsweise Testziel und den geprüften Quellstand angeben.
