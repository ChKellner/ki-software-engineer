---
name: skill-green
description: Implementiere aus fehlschlagenden Unit- und UI-Tests die minimale erforderliche Produktionsfunktionalität und verifiziere den grünen Testlauf. Als Green-Phase von TDD nach CreateInitialTest oder developer-red verwenden. Tests bleiben unverändert, außer ein Testfehler ist anhand der Anforderungen nachgewiesen.
---

# SkillGreen

Schließe die Red-Green-Schleife: Lies fehlschlagende Tests, verstehe ihre Erwartungen und implementiere die getestete
UI oder Funktionalität bis zum erfolgreichen Testlauf. Aufruf: `$skill-green` mit Testdateien, Fehlerausgaben oder der
Übergabe einer roten Phase. Eine vorherige Nutzung von CreateInitialTest oder developer-red ist keine Voraussetzung.

## Ausgangslage und Erwartungen verstehen

Prüfe Arbeitsbaum und geltende Agent-Anweisungen vor Änderungen. Bewahre vorhandene Änderungen, auch in noch nicht
versionierten Tests. Lies README für Setup und ARCHITECTURE.md vor Architekturänderungen; gleiche Angaben mit dem
aktuellen Code ab.

Nutze die benannten Tests und vorhandene Red-Übergabe. Fehlen Dateinamen, suche relevante Specs und führe passende
Tests zur Ermittlung der Fehler aus. Liegen mehrere unabhängige Aufgaben vor und ist der Umfang unklar, kläre die
Auswahl. Sind alle Tests bereits grün, verifiziere dies und berichte den Zustand, ohne neue Anforderungen zu erfinden.

Lies die vollständigen betroffenen Tests einschließlich Fixtures, Mocks, Setup und Assertions, nicht nur Fehlermeldungen.
Verbinde jede Erwartung mit vorhandenen Anforderungen oder Akzeptanzkriterien. Halte knapp fest:

- Welche Eingabe, Nutzeraktion oder Ausgangslage prüft der Test?
- Welches beobachtbare Ergebnis, welcher UI-Zustand oder öffentliche Vertrag wird erwartet?
- Welches fehlende oder falsche Produktionsverhalten erklärt den Fehler?

Reproduziere den roten Lauf vor Produktionsänderungen, soweit die Umgebung dies erlaubt. Unterscheide fachliche
Fehler, noch fehlende Produktionsschnittstellen, fehlerhafte Tests und Tooling-Probleme. Ein fehlender Runner oder
Browser belegt keinen Produktfehler. Behebe notwendige Testumgebungsprobleme im autorisierten Umfang, ohne Tests zu
deaktivieren oder die Testauswahl dauerhaft einzuschränken. Melde verbleibende Blockaden konkret.

## Minimales Produktionsverhalten implementieren

Ändere die zu testende UI oder Funktionalität. Nutze die bestehenden Verantwortlichkeiten und öffentlichen Verträge;
ergänze fehlende Schnittstellen, wenn die Anforderungen sie benötigen. Implementiere die kleinste vollständige Lösung
für die getesteten Anforderungen. Vermeide zusätzliche Features und vorgezogene, unabhängige Refactorings.

Behandle Tests als Verhaltensvertrag. Mache die echte Funktionalität korrekt: keine Erkennung von Testumgebungen,
keine hart codierten Antworten für einzelne Fixtures und keine Umgehung der zu prüfenden Logik. Halte erforderliche
Fehler-, Lade- und Grenzzustände sowie Zugänglichkeit und strikte Typisierung ein. Ein bestandener Beispieltest
rechtfertigt keine Lösung, die den beschriebenen Anwendungsfall offensichtlich verletzt.

Führe nach einer zusammenhängenden Änderung die betroffenen Tests aus. Analysiere verbleibende Fehler und wiederhole
gezielt, bis das vereinbarte Verhalten implementiert ist. Falls Tests widersprüchliche Verträge verlangen, kläre die
fachliche Entscheidung und arbeite an unabhängigen Teilen weiter; errate keine Priorität.

## Tests bewahren und echte Testfehler behandeln

Ändere bestehende Tests, Fixtures, Snapshots oder Testhelfer grundsätzlich nicht. Schwäche keine Assertions ab, entferne
keine Fälle und verwende kein `skip`, `fixme`, `only` oder erwartetes Fehlschlagen, um einen grünen Lauf herzustellen.
Verändere weder Timeouts noch Konfiguration oder Mocks, um einen Produktionsfehler zu verdecken.

Ein fehlschlagender Test ist nicht allein deshalb falsch, weil die Implementierung anders funktioniert. Eine Korrektur
ist nur zulässig, wenn ein konkreter Testdefekt nachgewiesen ist, etwa ein Widerspruch zu einer ausdrücklichen
Anforderung, eine nachweislich falsche Fixture oder ein vom Produktverhalten unabhängiger Setup-Fehler.

Dokumentiere vor einer solchen Ausnahme den Test, den Nachweis und die kleinste nötige Korrektur. Bewahre das fachliche
Prüfziel und die Stärke der Assertions. Ist die richtige Erwartung unklar oder hat der Nutzer Teständerungen ausdrücklich
ausgeschlossen, ändere den Test nicht und kläre den Konflikt. Berichte jede tatsächlich vorgenommene Testkorrektur
getrennt von Produktionsänderungen und prüfe danach erneut.

## Grün verifizieren und übergeben

Prüfe nach dem gezielten grünen Lauf die gesamte konfigurierte relevante Unit- und UI-Suite, damit Regressionen auch
außerhalb der ursprünglichen Fehler auffallen. Führe vorgeschriebene Build- und Formatprüfungen aus. Wiederhole nach
weiteren Änderungen die betroffenen Prüfungen. Überprüfe den abschließenden Diff, insbesondere auf Teständerungen und
unbeabsichtigte Nebenwirkungen. Behalte einen grünen Zustand bei einem eventuell beauftragten Refactoring bei.

Für BookMonkey gelten nach erneuter Prüfung der aktuellen Konfiguration:

- HTTP-Zugriffe und Endpunktkonstruktion bleiben im `BookApiClient`; Komponenten bleiben standalone und strikt typisiert.
- Unit-Tests: `npm test -- --watch=false`. Derzeit fehlen deklarierte Karma-/Jasmine-Abhängigkeiten trotz konfiguriertem
  Karma-Target. Ein nicht gestarteter Runner ist keine erfolgreiche Prüfung.
- Gezielte UI-Tests: `npx playwright test tests/<datei>.spec.ts --project=chromium` mit dem tatsächlichen Dateinamen.
  Vollständige UI-Suite: `npx playwright test` über die konfigurierten Browser. Playwright startet den Angular-Server;
  bei vollständig interceptierten API-Anfragen ist kein Mock-Backend nötig. Fremde Beispielseiten belegen kein App-Verhalten.
- Produktionsbuild: `npm run build`; Formatprüfung: `npx prettier --check <geänderte-dateien>`.
  Erhöhe keine Bundle-Budgets zur Fehlerumgehung und bearbeite keine generierten Ausgaben.

Berichte implementiertes Verhalten, geänderte Produktionsdateien und ausgeführte Prüfungen mit tatsächlichem Ergebnis.
Gib an, ob die Tests unverändert blieben, und begründe jede Ausnahme. Trenne bereits bestehende Fehler und blockierte
Prüfungen von neuen Regressionen. Behaupte nur dann, dass alle Tests grün sind, wenn die vollständigen benannten Suiten
tatsächlich erfolgreich liefen; bei Teilprüfungen nenne deren Umfang und verbleibende Grenzen ausdrücklich.
