# E-Mail Templates Dokumentation

Das Datenschutzportal verwendet [Jinja2](https://jinja.palletsprojects.com/) für E-Mail-Templates. Alle Templates befinden sich in diesem Ordner.

## Struktur

- `base.html`: Das Basis-Template, das das grundlegende Layout (Header, Footer, Styles) definiert. Alle anderen Templates sollten dieses Template erweitern.

## Verfügbare Templates

### 1. Upload Bestätigung (`email_confirmation_de.html`)
Wird nach erfolgreichem Upload an den Nutzer gesendet.

**Variablen:**
- `project_id`: ID des Projekts
- `project_title`: Titel des Projekts
- `uploader_name`: Name des Einreichenden
- `files`: Liste der hochgeladenen Dateien (Objekte mit `.filename` und `.category`)
- `timestamp`: Zeitpunkt des Uploads

### 2. Nachreichung erforderlich (`missing_documents.html`)
Wird gesendet, wenn Unterlagen fehlen (manuell ausgelöst oder durch Admin-Prozess).

**Variablen:**
- `project_id`: ID des Projekts
- `project_title`: Titel des Projekts
- `uploader_name`: Name des Einreichenden
- `missing_items`: Liste von Strings (fehlende Dokumente/Infos)
- `portal_url`: URL zum Datenschutzportal

### 3. Informationen (`user_info.html`)
Allgemeine Informationen für Nutzer.

**Variablen:**
- `name`: Name des Nutzers

## Neues Template erstellen

1. Erstellen Sie eine neue HTML-Datei (z.B. `neues_template.html`).
2. Erweitern Sie `base.html`:
   ```html
   {% extends "base.html" %}

   {% block title %}Betreff der E-Mail{% endblock %}

   {% block content %}
   <h2>Überschrift</h2>
   <p>Inhalt...</p>
   {% endblock %}
   ```
3. Implementieren Sie eine entsprechende Methode im `EmailService` (`backend/app/services/email_service.py`), die `send_template_email` aufruft und die benötigten Variablen als `context` übergibt.
