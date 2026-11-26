# Betrieb – webcam.sebastian-selle.de

Architektur und Aufbau: [ARCHITEKTUR.md](ARCHITEKTUR.md).

## Voraussetzungen auf dem Server

- nginx mit PHP (PHP-Version unklar, Code nutzt nur `date`, `time`, `glob`, `rsort`, `array_slice`)
- Bash, `curl`
- Python 3 mit `requests` (Archiv)
- optional ImageMagick, Python-Pakete `opencv-python` und `numpy` (Wolkenzug-Analyse)
- Netzwerkzugriff vom Server auf beide Kameras im lokalen Netz

## Deploy

Ein Deploy-Skript gibt es nicht. Ablauf laut Pfaden im Code:

1. Repo-Inhalt nach `/var/www/html/webcam.sebastian-selle.de` bringen (Methode unklar).
2. `bilder/` und `bilder/static/archive/` müssen für den Benutzer beschreibbar sein, unter dem die Skripte laufen.
3. `reolink_snapshot.sh` dauerhaft starten (Endlosschleife). Wie das aktuell eingerichtet ist, ist unklar; naheliegend ist ein systemd-Dienst.
4. `scripts/archive_webcam.py` stündlich ausführen, mit Arbeitsverzeichnis `scripts/` (relativer Zielpfad). Aktuelle Einrichtung unklar.

## Wartung

- `reolink_snapshot.sh` löscht selbst alle bis auf die 10 neuesten Zeitstempel-Kopien je Kamera.
- Das Archiv wächst unbegrenzt (ein Bild pro Stunde). Alte Dateien in `bilder/static/archive/` bei Bedarf manuell löschen; die Seite zeigt nur die neuesten 24.
- CDN-Bibliotheken (Leaflet, leaflet-semicircle, SunCalc) sind nicht gepinnt. Nach Darstellungsfehlern zuerst dort suchen.
- Kamera-Passwort oder API-Key ändern: Werte stehen direkt in `reolink_snapshot.sh` bzw. `scripts/weather.js`.

## Fehlersuche

| Symptom | Prüfen |
|---|---|
| Bilder bleiben stehen | Läuft `reolink_snapshot.sh`? Kamera aus dem Server erreichbar (`curl` auf die Snap-API)? Schreibrechte auf `bilder/`? |
| Bild leer/kaputt | `curl` schreibt bei Fehlern die Antwort der Kamera in die JPG-Datei; Dateiinhalt prüfen. Falsches Passwort oder Kamera offline. |
| „Wetterdaten konnten nicht geladen werden.“ | Browser-Konsole; OpenWeatherMap-Key gültig, Kontingent nicht erschöpft? |
| Karte leer | unpkg.com oder OpenStreetMap-Kacheln erreichbar? Browser-Konsole. |
| Archiv-Galerie leer | Läuft `archive_webcam.py`? Ausgabe `[OK]`/`[FEHLER]` im Cron-Log; Aufruf aus `scripts/` heraus? |
| Alte Bilder trotz Reload | Service Worker (`sw.js`) cached Cache-first; im Browser Service Worker abmelden / Website-Daten löschen. |
| 403 auf `/bilder/` | Erwartet: Verzeichnisauflistung ist in nginx gesperrt (siehe `logs/error.log`). |

Server-Logs: nginx `access.log` / `error.log` (Pfad auf dem Server unklar; im Repo liegt unter `logs/` eine alte Kopie).
