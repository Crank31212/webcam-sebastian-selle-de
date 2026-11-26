# Architektur – webcam.sebastian-selle.de

## Zweck

Webseite mit zwei Live-Webcams (Blick nach Westen und nach Süden) am Standort der Modern Next GmbH in Westerstede. Zusätzlich zeigt die Seite Wetterdaten, eine Karte mit Blickrichtung und Wind, eine Einschätzung der Bedingungen für Cessna-Flug und Fallschirmsprung (Stufen A/B/C), Sonnenauf- und -untergang sowie ein stündliches Bildarchiv. Die Seite ist als PWA angelegt.

## Technik-Stack

| Bereich | Technik |
|---|---|
| Seite | PHP (`index.php`), serverseitig gerendert, kein Framework |
| Frontend | Vanilla JavaScript als ES-Module (`scripts/`), CSS (`styles/main.css`) |
| Bibliotheken (per CDN unpkg.com, ohne feste Version) | Leaflet, leaflet-semicircle, SunCalc |
| Bildbezug | Bash + `curl` (`reolink_snapshot.sh`), Reolink-Kameras über deren HTTP-API (`cmd=Snap`) |
| Archiv | Python 3 mit `requests` (`scripts/archive_webcam.py`) |
| Wolkenzug-Analyse (experimentell) | Bash + ImageMagick `convert`, Python 3 mit OpenCV und NumPy |
| Webserver | nginx (laut Format von `logs/error.log`) |

Es gibt keinen Build-Schritt, kein Paketmanagement und keine Tests.

## Verzeichnisstruktur

```
index.php                  Hauptseite: zwei Kamerabilder, Karte, Wetter, Archiv-Galerie
manifest.json              PWA-Manifest
sw.js                      Service Worker (Cache-first)
styles/main.css            Styles
scripts/
  main.js                  Einstieg: Uhrzeit, Bild-Refresh, Karte, Wetter, Sonne, Vollbild
  weather.js               Abruf OpenWeatherMap-Forecast, Wetterbox
  flightConditions.js      Einstufung Fliegen/Springen aus Wind, Wolken, Regen
  map.js                   Leaflet-Karte, Sichtkegel der Kameras, animierter Windpfeil
  utils.js                 Gradzahl zu Himmelsrichtung, Punktverschiebung (Geodäsie)
  archive_webcam.py        Speichert das aktuelle Westbild als stündliches Archivbild
bilder/                    Live-Bilder westen.jpg / sueden.jpg (per .gitignore ausgeschlossen)
  static/archive/          Archivbilder YYYY-MM-DD_HH.jpg
  index.html, index.php    leere Platzhalter (verhindern Verzeichnisauflistung)
reolink_snapshot.sh        Endlosschleife: holt Kamerabilder, hält 10 Sicherungskopien
analyse_cloud_direction.sh Differenzbilder aus drei Aufnahmen, ruft analyze_motion.py
analyze_motion.py          Optical Flow (Farneback), gibt Wolkenzugrichtung aus
logs/                      nginx access.log / error.log (im Repo eingecheckt)
```

## Komponenten und Datenfluss

```
Reolink-Kamera West ─┐                       ┌─> bilder/westen.jpg ─┐
                     ├─ reolink_snapshot.sh ─┤                      ├─> Browser (index.php + main.js)
Reolink-Kamera Süd ──┘   (alle ~2 s, curl)   └─> bilder/sueden.jpg ─┘      lädt Bilder alle 2 s neu

https://webcam.../bilder/westen.jpg ── archive_webcam.py ──> bilder/static/archive/YYYY-MM-DD_HH.jpg
                                                              (index.php zeigt die neuesten 24)

Browser ── OpenWeatherMap Forecast API ──> Wetterbox, Flug-/Sprung-Einstufung, Windpfeil
Browser ── OpenStreetMap-Kacheln ──> Karte
Browser ── SunCalc (lokal gerechnet) ──> Sonnenzeiten
```

1. **Bildbezug**: `reolink_snapshot.sh` läuft als Endlosschleife (2 s Pause), lädt per `curl -k` je ein Snapshot pro Kamera aus dem lokalen Netz und schreibt sie nach `bilder/westen.jpg` und `bilder/sueden.jpg`. Zusätzlich entstehen Kopien mit Unix-Zeitstempel; nur die 10 neuesten je Kamera bleiben. Der Pfad ist fest auf `/var/www/html/webcam.sebastian-selle.de/bilder` gesetzt.
2. **Seite**: `index.php` gibt die Serverzeit aus, bindet die Bilder mit Cache-Buster `?t=` ein und listet per `glob` die neuesten 24 Archivbilder.
3. **Frontend**: `main.js` aktualisiert Uhrzeit (1 s) und Bilder (2 s), zeichnet die Karte mit den Sichtkegeln (87° Öffnungswinkel, West 270°, Süd 180°), lädt die Wettervorhersage und berechnet die Sonnenzeiten für die fest hinterlegte Kameraposition. Klick auf ein Bild schaltet Vollbild.
4. **Einstufung** (`flightConditions.js`), Schwellen aus dem Code:
   - Fliegen: A bei Wolken < 60 %, Wind ≤ 6 m/s, kein Regen; B bei Wolken < 80 %, Wind ≤ 8 m/s; sonst C.
   - Fallschirmsprung: A bei Wind ≤ 4 m/s, Wolken < 40 %; B bei Wind ≤ 6 m/s, Wolken < 70 %; sonst C.
   - Die Einstufung ist eine reine Heuristik aus OpenWeatherMap-Daten, keine fachliche Flugwetterberatung.
5. **Archiv**: `archive_webcam.py` lädt das Westbild über die öffentliche URL und speichert es unter `../bilder/static/archive` (relativer Pfad, muss also aus `scripts/` heraus gestartet werden).
6. **Wolkenzug-Analyse**: `analyse_cloud_direction.sh img1 img2 img3` erzeugt zwei Differenzbilder und gibt über `analyze_motion.py` Winkel und Himmelsrichtung aus. Nicht an die Seite angebunden.

## Externe Dienste und Abhängigkeiten

- OpenWeatherMap, Endpoint `data/2.5/forecast` (Stadt-ID, metrisch, deutsch); Aufruf direkt aus dem Browser.
- OpenStreetMap-Tile-Server für die Karte.
- unpkg.com für Leaflet, leaflet-semicircle, SunCalc (jeweils neueste Version, nicht gepinnt).
- Zwei Reolink-Kameras im lokalen Netz (HTTP-API, Self-signed-Zertifikat, daher `curl -k`).
- Server-seitig: PHP, Bash, `curl`; für das Archiv Python 3 + `requests`; für die Analyse ImageMagick, OpenCV (`cv2`), NumPy.

## Build

Kein Build. Die Dateien werden so, wie sie im Repo liegen, vom Webserver ausgeliefert.

## Deploy und Hosting

- Zielpfad laut Skripten und Logs: `/var/www/html/webcam.sebastian-selle.de` auf einem nginx-Server mit PHP.
- Wie Code auf den Server kommt (git pull, rsync, manuell): unklar, im Repo nicht beschrieben.
- Wie `reolink_snapshot.sh` dauerhaft läuft (systemd, screen, cron @reboot): unklar.
- Wie `archive_webcam.py` stündlich ausgelöst wird (vermutlich cron): unklar.
- nginx- und PHP-Konfiguration liegen nicht im Repo.

Details zum Betrieb: [BETRIEB.md](BETRIEB.md).

## Konfiguration und Secrets

Es gibt keine Umgebungsvariablen und keine Konfigurationsdatei. Alle Werte stehen fest im Code:

| Wert | Ort |
|---|---|
| Kamera-Adressen, Kamera-Benutzer und -Passwort | `reolink_snapshot.sh` (Variablen im `curl`-Aufruf: `user`, `password`, `rs`) |
| OpenWeatherMap-API-Key, Stadt-ID | `scripts/weather.js` (`apiKey`, `cityId`) |
| Kamerakoordinaten, Blickrichtungen | `scripts/main.js` (`camLat`, `camLng`, `camDirections`) |
| Bildverzeichnis, Anzahl Sicherungskopien | `reolink_snapshot.sh` (`IMG_DIR`, `MAX_BACKUPS`) |
| Archiv-Quelle und -Ziel | `scripts/archive_webcam.py` (`WEBCAM_URL`, `ARCHIVE_DIR`) |

## Bekannte Besonderheiten und offene Punkte

- **Secrets im Klartext in einem öffentlichen Repo**: `reolink_snapshot.sh` enthält Zugangsdaten der Kameras, `scripts/weather.js` den OpenWeatherMap-Key. Beides ist in der Git-Historie. Empfehlung: Kamera-Passwort und API-Key wechseln, Zugangsdaten in eine nicht versionierte Datei oder Umgebungsvariable auslagern. Der API-Key wird im Browser verwendet und ist damit ohnehin öffentlich; ein serverseitiger Proxy würde das vermeiden.
- **Logs im Repo**: `logs/access.log` und `logs/error.log` sind eingecheckt und enthalten Client-IP-Adressen (personenbezogene Daten). Sollten aus dem Repo entfernt und in `.gitignore` aufgenommen werden.
- **Service Worker**: `sw.js` cached `/index.html`, die Seite ist aber `index.php`; die Installation des Caches schlägt damit vermutlich fehl. Die Strategie ist Cache-first ohne Aktualisierung, Live-Bilder könnten so veraltet aus dem Cache kommen. Wo `sw.js` registriert wird, ist im Code nicht zu sehen (keine `navigator.serviceWorker.register`-Stelle gefunden).
- **PWA-Icons**: `icon-192.png` und `icon-512.png` werden in `manifest.json` und `sw.js` referenziert, liegen aber nicht im Repo.
- **Zeitgestempelte Sicherungskopien** aus `reolink_snapshot.sh` werden von der Seite nicht genutzt; Zweck unklar.
- **Archivbilder** in `bilder/static/archive/` sind nicht von `.gitignore` erfasst (dort nur `/bilder/*.jpg`); ein Beispielbild ist eingecheckt. Eine Aufräumregel für alte Archivbilder gibt es nicht.
- **CDN-Bibliotheken** sind nicht versioniert, ein Update bei unpkg kann die Seite unbemerkt ändern.
- **README** verweist bei der Installation auf ein Platzhalter-Repo (`dein-benutzername/sebastian-selle-webcam`).
- `analyse_cloud_direction.sh` / `analyze_motion.py` sind ein loses Experiment, nicht in Seite oder Cron eingebunden (soweit erkennbar).
