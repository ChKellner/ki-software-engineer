---
name: create-initial-test
description: Erstelle aus Anforderungen oder Akzeptanzkriterien initiale Unit- und UI-Tests für die rote Phase von TDD, möglichst vor der Implementierung. Verwenden, wenn Tests zuerst entstehen oder fehlendes Verhalten durch Regressionstests nachgewiesen werden soll; endet mit Tests und deren Fehlernachweis, sofern keine Implementierung beauftragt ist.
---

# CreateInitialTest

Überführe Anforderungen in aussagekräftige Unit- und UI-Tests, die das gewünschte Verhalten beschreiben und vor der
Implementierung aus dem fachlich erwarteten Grund fehlschlagen. Aufruf: `$create-initial-test` mit Anforderungen,
einer User Story oder Given/When/Then-Akzeptanzkriterien.

## Anforderungen und Ausgangslage

Lies die Anforderungen aus dem Gespräch oder den vom Nutzer benannten Quellen. Übernimm bereits abgestimmte Kriterien;
starte keine erneute Anforderungsaufnahme. Fehlen Anforderungen ganz, frage nach dem gewünschten Verhalten. Kläre nur
Unklarheiten, die Eingaben, erwartete Ergebnisse oder Umfang der Tests wesentlich verändern. Erfinde keine fachlichen
Regeln. Bearbeite währenddessen unabhängig davon klare Kriterien weiter.

Prüfe vor Änderungen den Arbeitsbaum, geltende Agent-Anweisungen, vorhandene Tests, Testkonfiguration und relevante
Quellen. Bewahre fremde Änderungen. Nutze README und bei geplanten Architekturänderungen ARCHITECTURE.md; verifiziere
Angaben anhand des aktuellen Codes. Führe vorhandene relevante Tests nach Möglichkeit als Ausgangsmessung aus und
trenne bereits bestehende Fehler von neuen Fehlern.

Ordne jedem Akzeptanzkriterium einen Test oder eine begründete Abdeckungslücke zu. Nutze vorhandene Kriteriennummern
wie AC1 in Testnamen; vergib bei Bedarf lokale Kennungen, ohne die Anforderungen umzudeuten. Halte pro Kriterium
Testebene, konkrete Eingabe, erwartetes Ergebnis und erwarteten Fehlergrund fest. Eine kompakte Übersicht im Gespräch
genügt, sofern kein Anforderungsdokument gepflegt werden soll.

## Tests vor der Implementierung erstellen

Schreibe zuerst die Tests. Leite Erwartungen aus den Anforderungen ab, nicht aus dem aktuellen fehlerhaften Verhalten.
Nutze vorhandene öffentliche Schnittstellen und Testkonventionen. Für neue Schnittstellen beschreibe den kleinsten
benötigten Vertrag und kennzeichne vorgeschlagene Namen als technische Annahme.

- **Unit-Tests:** Prüfe fachliche Regeln, Transformationen, Validierung oder Komponentenverhalten isoliert an der
  zuständigen Grenze. Verwende konkrete Ein- und Ausgaben, typisierte Fixtures und kontrollierte Abhängigkeiten.
  Prüfe beobachtbare Ergebnisse statt privater Methoden, interner Aufrufreihenfolgen oder kopierter Implementierung.
- **UI-Tests:** Prüfe die vereinbarten Nutzerabläufe im Browser: Ausgangszustand, Interaktion und sichtbares Ergebnis.
  Nutze bevorzugt Rollen und zugängliche Namen sowie automatisch wartende Assertions. Kontrolliere API-Antworten und
  andere externe Einflüsse deterministisch. Vermeide feste Wartezeiten und Abhängigkeiten von Live-Daten.
- Decke Hauptablauf und die geforderten Grenz- und Fehlerfälle ab. Prüfe Lade-, Leer- und Fehlerzustände sowie
  konkurrierende Anfragen, soweit sie zum vereinbarten Verhalten gehören. Erfinde keine zusätzlichen Produktanforderungen.
- Erzeuge für Anforderungen mit Fachlogik und Nutzerinteraktion Unit- und UI-Tests mit jeweils eigenem Prüfzweck.
  Falls eine Ebene keinen sinnvollen Prüfgegenstand hat, begründe die Auslassung statt künstliche Tests zu ergänzen.

Füge keine absichtlich falschen Erwartungen, bedingungslosen Fehler, deaktivierten Tests, `skip`, `fixme` oder `only`
hinzu. Mocke Abhängigkeiten, aber nicht das zu prüfende Verhalten selbst. Implementiere keine Produktlogik, um die Tests
ausführbar oder grün zu machen. Ein notwendiges Produktionsgerüst liegt außerhalb dieses Skills, sofern es nicht
ausdrücklich beauftragt ist. Änderungen an Testkonfiguration und Abhängigkeiten müssen tatsächlich benötigt und durch
den Auftrag gedeckt sein; führe keinen pauschalen Framework-Wechsel durch.

## Rote Phase nachweisen

Führe die neuen Tests gezielt aus und prüfe bei jedem Fehler, ob er das fehlende vereinbarte Verhalten nachweist.
Ein roter Prozess allein ist kein ausreichender TDD-Nachweis.

- **Erwartet rot:** Der Test läuft und die Assertion oder eine gezielte UI-Erwartung scheitert, weil das geforderte
  Verhalten fehlt. Bei UI-Timeouts prüfe, ob die Anwendung erreichbar ist und die fehlende Interaktion tatsächlich
  Bestandteil des Kriteriums ist.
- **Bereits grün:** Das Verhalten ist bereits vorhanden. Berichte den Test als bestehende Abdeckung; beschädige weder
  Test noch Anwendung, um einen Fehler zu erzwingen. Suche nur innerhalb der Anforderungen nach weiteren offenen Fällen.
- **Noch nicht ausführbar:** Fehlende Module, Exporte oder neue Schnittstellen verhindern Kompilierung oder Discovery.
  Beschreibe den fehlenden Vertrag und kennzeichne dies getrennt vom fachlichen Fehlernachweis.
- **Tooling blockiert:** Fehlende Runner, Browser, Abhängigkeiten, Startfehler oder Infrastrukturprobleme sind kein
  fachlicher Fehlernachweis. Behebe durch den Auftrag gedeckte Testprobleme gezielt; andernfalls liefere die Testdateien
  mit dem konkreten Hindernis und dem noch auszuführenden Befehl. Behaupte keine erfolgreiche rote Phase.

Korrigiere Fehler in Fixtures, Selektoren oder Testaufbau und wiederhole die betroffenen Tests. Prüfe anschließend
relevante bestehende Tests und Formatierung. Nutze einen Build, wenn geltende Repository-Anweisungen oder Änderungen
ihn erfordern; ordne mögliche Kompilierungsfehler durch fehlende neue Schnittstellen ausdrücklich ein.

## Hinweise für dieses Repository

Prüfe diese Angaben bei Verwendung erneut gegen die aktuelle Konfiguration:

- BookMonkey nutzt Angular mit standalone Komponenten und striktem TypeScript. Lege Unit-Specs bei der getesteten
  Quelle unter `src/app/` ab und Browser-Specs unter `tests/`. Nutze Angular TestBed und HTTP-Testwerkzeuge passend
  zum vorhandenen Test-Stack; HTTP-Zugriffe bleiben in `BookApiClient`.
- Playwright startet den Angular-Server über die Konfiguration. Übernimm Navigation und API-Interception aus den
  vorhandenen App-Tests. Interzeptiere relevante Requests vor der Navigation; ein laufendes Mock-Backend ist dann
  für diese Requests nicht erforderlich. Tests fremder Beispielseiten validieren BookMonkey nicht.
- Unit-Befehl: `npm test -- --watch=false`. Derzeit ist ein Karma-Target konfiguriert, jedoch fehlen deklarierte
  Karma-/Jasmine-Abhängigkeiten. Behaupte deshalb ohne erfolgreichen Runner-Start keinen Unit-Fehlernachweis.
- UI-Befehl: `npx playwright test tests/<datei>.spec.ts --project=chromium`; ersetze den Dateinamen durch die neue Spec.
  Weitere Prüfungen nach Bedarf: `npm run build` und `npx prettier --check <geänderte-dateien>`.
- Ändere weder generierte Ausgaben noch produktive Funktionen oder Bundle-Budgets für diese rote Phase.

## Übergabe

Berichte die angelegten Testdateien, die Zuordnung zu Anforderungen, ausgeführte Befehle und den tatsächlichen Status
pro Kriterium bzw. Testebene. Nenne bei roten Tests die entscheidende Assertion und warum sie erwartungsgemäß scheitert;
trenne bereits grüne Tests, vorherige Fehler und Ausführungsblockaden klar davon.

Beende den Auftrag nach der roten Phase mit einer knappen Beschreibung des noch zu implementierenden Verhaltens.
Nur wenn der Nutzer auch die Implementierung beauftragt hat, fahre danach mit Grün und Refactoring fort; bewahre die
fachlichen Erwartungen der Tests und dokumentiere den roten Nachweis vor Produktionsänderungen.
