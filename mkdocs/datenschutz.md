# Datenschutz und Verarbeitungstätigkeiten

Diese Dokumentation beschreibt die Verarbeitung personenbezogener Daten und projektbezogener Informationen innerhalb des Datenschutzportals.

## Überblick der Verarbeitung

Das Portal dient der digitalen Einreichung von Datenschutzunterlagen für Forschungsprojekte. Die Daten werden vom Nutzer eingegeben, validiert, sicher übertragen und in einer internen Nextcloud-Instanz gespeichert.

### Datenkategorien

Im Rahmen der Nutzung werden folgende Datenkategorien verarbeitet:

1.  **Personenbezogene Daten des Einreichers:**
    *   Name (Optional)
    *   E-Mail-Adresse (Pflichtfeld zur Kontaktaufnahme und Bestätigung)
    *   Zugehörige Institution (Universität Frankfurt oder Universitätsklinikum)

2.  **Projektdaten:**
    *   Projekttitel
    *   Projektbeschreibung / Details
    *   Art der Studie (z.B. prospektiv)
    *   Projekttyp (Neueinreichung oder Nachreichung zu bestehendem Projekt)

3.  **Dokumente:**
    *   Datenschutzkonzepte
    *   Verantwortungsübernahmen
    *   Schulungsnachweise
    *   Einwilligungserklärungen
    *   Ethikvoten
    *   Sonstige projektbezogene Dateien

## Technische Verarbeitung

### 1. Upload und Validierung
*   Daten werden über eine verschlüsselte Verbindung (HTTPS) an die API übermittelt.
*   Die API validiert Dateitypen (z.B. PDF) und Dateigrößen.
*   Projektitel werden für die Ordnerstruktur bereinigt (Entfernung von Sonderzeichen).

### 2. Speicherung (Nextcloud)
*   Die Speicherung erfolgt in einer intern gehosteten Nextcloud-Instanz.
*   Für jedes Projekt wird ein eindeutiger Ordner basierend auf dem Projekttitel und dem Datum erstellt.
*   Dateien werden in Unterordnern gemäß ihrer Kategorie (z.B. "datenschutzkonzept") abgelegt.
*   Zusätzlich wird eine `metadata.json` (maschinenlesbar) und eine `README.md` (menschenlesbar) mit allen Projektinformationen generiert und gespeichert.

### 3. Benachrichtigungen (E-Mail)
Das System versendet automatisch E-Mails über einen konfigurierten SMTP-Server:
*   **Bestätigung an den Nutzer:** Enthält eine Zusammenfassung der eingereichten Dateien und die Projekt-ID.
*   **Benachrichtigung an das Team:** Informiert die Datenschutzbeauftragten über den neuen Eingang.

## Zugriff und Sicherheit

*   **Authentifizierung:** Die API ist durch Token geschützt.
*   **Zugriff:** Zugriff auf die gespeicherten Daten in der Nextcloud haben nur autorisierte Mitarbeiter des Datenschutzteams.
*   **Verschlüsselung:** Die Übertragung erfolgt Transportverschlüsselt (TLS). Die Speicherung auf dem Server unterliegt den Sicherheitsstandards des Rechenzentrums.

## Löschfristen

Die Daten werden gemäß den gesetzlichen Aufbewahrungsfristen für Forschungsvorhaben und Datenschutzdokumentation gespeichert. Nach Ablauf der Zweckbindung oder der gesetzlichen Fristen werden die Daten gelöscht.
