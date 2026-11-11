---
name: skill-refactor
description: Prüfe nach der TDD-Green-Phase Anforderungen, Tests und Implementierung kritisch und refaktoriere verhaltenserhaltend nach Projektstandards und SOLID. Baut auf create-initial-test und skill-green auf; fasst für den Anwender getestete und umgesetzte Anforderungen sowie verbleibende Lücken zusammen.
---

# SkillRefactor

Schließe die Red-Green-Refactor-Schleife mit einer kritischen Prüfung und gezielten Strukturverbesserungen ab.
Aufruf: `$skill-refactor` mit der Green-Übergabe, relevanten Dateien oder dem aktuellen Anforderungsumfang.
Eine vorherige Ausführung der anderen Skills ist nicht erforderlich, wenn Anforderungen und Ausgangslage belegbar sind.
Bei einem ausdrücklich reinen Review liefere Befunde und Empfehlungen, ohne Dateien zu ändern.

## Kontext und Ausgangszustand

Prüfe Arbeitsbaum, geltende Agent-Anweisungen, README, relevante Tests und Produktionsdateien. Bewahre bestehende und
unversionierte Änderungen. Lies ARCHITECTURE.md vor Architekturänderungen und gleiche Angaben mit dem aktuellen Code ab.
Begrenze die Prüfung auf die vereinbarte Funktion und ihre unmittelbar betroffenen Verantwortlichkeiten.

Übernimm Anforderungen, Akzeptanzkriterien und Red-/Green-Nachweise aus dem Gespräch oder den benannten Quellen.
Nutze bei fehlendem Aufgabenkontext [recover-context](../recover-context/SKILL.md). Leite Anforderungen weder allein aus
Tests noch aus der Implementierung ab. Kennzeichne Annahmen und kläre nur Widersprüche, die das weitere Vorgehen verändern.

Führe die betroffenen Tests als Ausgangsmessung aus. Unterscheide erfolgreiche Prüfungen, fachliche Fehler und
Tooling-Blockaden. Eine frühere Green-Übergabe ersetzt keinen aktuellen Nachweis. Bei fachlich roten Tests stelle zuerst
das vereinbarte Verhalten mit [skill-green](../SkillGreen/SKILL.md) wieder her, soweit dies im Auftrag liegt; beginne kein
strukturelles Refactoring auf ungeklärten Fehlern. Bei blockierten Prüfungen kann das Review weitergehen; beschreibe die
Verifikationsgrenze und vermeide größere Umbauten ohne ausführbares Sicherheitsnetz.

## Anforderungen für den Anwender zusammenfassen

Gib vor Änderungen eine kompakte, verständliche Übersicht im Gespräch. Nutze vorhandene Kriterienkennungen und ordne zu:

| Anforderung und Quelle | Test und geprüftes Ergebnis | Umsetzung | Nachweis oder Lücke |
| ---------------------- | --------------------------- | --------- | ------------------- |

Fülle die Übersicht mit konkreten Testnamen und Dateiverweisen. Unterscheide ausdrücklich zwischen vorhandenem Test,
tatsächlich erfolgreichem Testlauf und im Code nachvollziehbarer Umsetzung. Markiere fehlende, teilweise oder nicht
ausführbar geprüfte Abdeckung. Behaupte keine vollständige Umsetzung allein aufgrund grüner Tests.
Eine zusätzliche Anforderungsdatei ist nur bei entsprechendem Auftrag oder bestehender Projektkonvention nötig.

## Tests und Implementierung kritisch prüfen

Prüfe beide unabhängig gegen die Anforderungen. Ein grüner Test kann ein falsches oder unzureichendes Verhalten absichern.
Halte konkrete Befunde mit Dateiverweis, Auswirkung und kleinstem sinnvollem nächsten Schritt fest. Trenne nachgewiesene
Defekte, Abdeckungslücken und begründete Strukturverbesserungen; erfinde keine Befunde, um eine Checkliste zu füllen.

### Testqualität

- Prüfen Assertions das fachlich geforderte, beobachtbare Ergebnis oder nur Existenz, interne Aufrufe und Implementierung?
- Würde eine plausible fehlerhafte Implementierung weiterhin bestehen, etwa eine konstante Antwort oder ignorierte Eingabe?
  Begründe die Schwäche anhand eines konkreten Beispiels; Mutationstooling ist keine Voraussetzung.
- Verdecken Mocks die zu prüfende Logik? Sind Fixtures und Erwartungen unabhängig genug von der Implementierung?
- Sind die aus den Anforderungen folgenden Grenz-, Fehler-, Lade- und Leerzustände sowie relevante konkurrierende Anfragen
  abgedeckt? Trenne fehlende geforderte Fälle von optionalen Produktideen.
- Sind Unit- und UI-Tests ihrem Prüfzweck angemessen, deterministisch und aussagekräftig? Prüfe bei UI-Tests zugängliche
  Selektoren, kontrollierte API-Antworten und automatisch wartende Assertions statt fester Wartezeiten.
- Machen Duplikation, überladene Testhelfer oder gemeinsam veränderter Zustand Tests schwer verständlich oder instabil?

### Projektstandards und Design

Begründe Änderungen mit einer konkreten Verbesserung im betroffenen Code. SOLID rechtfertigt keine vorsorglichen
Interfaces, zusätzlichen Schichten oder Framework-Wechsel.

- **Eine Komponente pro Datei:** Halte produktive Komponenten getrennt und passend benannt; beachte bestehende Konventionen
  für Templates und Styles. Kleine ausschließlich lokale Testkomponenten dürfen dem Testaufbau folgen.
- **Konsistente Abstraktionsebenen:** Mische fachliche Ablaufsteuerung nicht mit HTTP-Details, DOM-Manipulation oder
  kleinteiliger Datenaufbereitung in derselben Funktion. Extrahiere nach Verantwortung, nicht nach beliebiger Zeilenzahl.
- **Single Responsibility:** Trenne Darstellung, Ablaufsteuerung, Datenzugriff und eigenständige Fachlogik dort, wo sie
  unterschiedliche Änderungsgründe haben. Vermeide Komponenten oder Services mit fachfremden Aufgaben.
- **Open/Closed und Liskov:** Prüfe vorhandene Erweiterungspunkte und austauschbare Implementierungen auf stabile Verträge,
  einschließlich Fehlerverhalten und Vorbedingungen. Führe keine Hierarchien für hypothetische Varianten ein.
- **Interface Segregation und Dependency Inversion:** Halte benötigte Verträge klein und Abhängigkeiten an der zuständigen
  Grenze ersetzbar. Nutze vorhandene Dependency Injection; abstrahiere konkrete Details nur bei erkennbarem Nutzen.
- **Reaktive Komposition:** Drücke abhängige asynchrone Abläufe durch passende RxJS-Komposition aus, statt Subscriptions zu
  verschachteln oder Zustand mehrfach zu synchronisieren. Wähle Operatoren nach gewünschter Abbruch-, Reihenfolge- und
  Parallelitätssemantik. Prüfe Fehlerbehandlung, Ladezustände, Subscription-Lebensdauer und veraltete Antworten.
  Eine Umstellung auf `switchMap` ist beispielsweise nur korrekt, wenn neuere Anfragen ältere tatsächlich ersetzen sollen.
- Bewahre strikte Typen, öffentliche Verträge, Zugänglichkeit und responsive Darstellung. Entferne tote Logik und unnötige
  Duplikation, ohne fachlich verschiedene Konzepte allein wegen ähnlichen Codes zusammenzufassen.

## Befunde umsetzen und Grün bewahren

Priorisiere Korrektheit und belastbare Abdeckung vor struktureller Eleganz. Führe kleine, zusammenhängende Refactorings im
autorisierten Umfang aus; eine unveränderte Implementierung ist ein gültiges Ergebnis, wenn kein sinnvoller Bedarf besteht.
Erweitere den Auftrag nicht auf eine allgemeine Modernisierung oder fachfremde Bereinigung.

Fehlt ein geforderter Verhaltenstest, ergänze ihn vor einem davon abhängigen Umbau mit
[create-initial-test](../CreateInitialTest/SKILL.md). Besteht er bereits, ist er zusätzliche Absicherung; erzwinge kein Rot.
Deckt er einen Produktfehler auf, dokumentiere den fachlichen roten Nachweis, behebe ihn mit `skill-green` und beginne erst
danach das Refactoring. Kennzeichne diese Fehlerkorrektur getrennt von verhaltenserhaltenden Änderungen.

Tests dürfen ebenfalls refaktoriert werden, wenn fachliche Erwartungen, Assertions und Fallabdeckung erhalten bleiben.
Ändere Erwartungen nur bei einem anhand der Anforderungen nachgewiesenen Testdefekt und dokumentiere den Nachweis.
Schwäche keine Assertions ab und entferne oder deaktiviere keine Fälle, um Grün herzustellen. Vermeide gleichzeitige
Änderungen desselben Verhaltens in Test und Produktion ohne unabhängige Absicherung. Respektiere ausdrückliche Verbote
von Teständerungen; melde dann die Lücke und begrenze davon abhängige Umbauten.

Prüfe nach jedem zusammenhängenden Umbau die betroffenen Tests. Führe abschließend die relevanten konfigurierten Suiten,
den vorgeschriebenen Build und gezielte Formatprüfungen aus. Prüfe den Diff auf unbeabsichtigte Verhaltensänderungen und
verlorene Testabdeckung. Aktualisiere ARCHITECTURE.md, wenn sich dokumentierte Grenzen, Datenfluss oder Setup ändern.

Für BookMonkey gilt nach Abgleich mit der aktuellen Konfiguration:

- Komponenten bleiben standalone; HTTP-Anfragen und Endpunktkonstruktion gehören in `BookApiClient`.
  Folge den vorhandenen Angular-Mustern; führe Signals, neue Zustandsbibliotheken oder SSR nur bei entsprechendem Auftrag ein.
- Nutze `npm run build`, die relevanten Playwright-Specs und abschließend `npx playwright test` über die konfigurierten Browser.
  Kontrolliere API-Anfragen deterministisch. Fremde Beispielseiten validieren kein BookMonkey-Verhalten.
- Prüfe `npm test -- --watch=false`, soweit der Unit-Stack verfügbar ist. Fehlende Karma-/Jasmine-Abhängigkeiten oder Browser
  sind Tooling-Blockaden und kein erfolgreicher Testlauf. Benenne den tatsächlichen Umfang jeder Prüfung.
- Nutze `npx prettier --check <geänderte-dateien>`. Ändere keine generierten Ausgaben und erhöhe keine Bundle-Budgets zur
  Fehlerumgehung. Neue Abhängigkeiten müssen für den Auftrag tatsächlich erforderlich sein.

## Abschluss für den Anwender

Aktualisiere die Anforderungsübersicht mit dem endgültigen Stand und berichte knapp:

- Welche Anforderungen getestet und umgesetzt sind, mit konkreten Belegen und verbleibenden Lücken.
- Welche kritischen Befunde vorlagen, welche behoben wurden und welche mit Begründung offenbleiben.
- Welche Refactorings Tests oder Produktion verbessern und welches Projekt- oder SOLID-Prinzip den Ausschlag gab.
- Welche Prüfungen mit welchem Ergebnis liefen, einschließlich vorbestehender Fehler und blockierter Prüfungen.

Behaupte vollständiges Grün nur für tatsächlich erfolgreich ausgeführte Suiten. Benenne verbleibende Risiken und den
nächsten erforderlichen Schritt, ohne aus Empfehlungen ungefragt neue Anforderungen zu machen.
