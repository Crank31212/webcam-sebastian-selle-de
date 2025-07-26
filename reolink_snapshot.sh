#!/bin/bash

IMG_DIR="/var/www/html/webcam.sebastian-selle.de/bilder"
MAX_BACKUPS=10

while true; do
  TIMESTAMP=$(date +%s)
  WESTEN="$IMG_DIR/westen.jpg"
  SUEDEN="$IMG_DIR/sueden.jpg"
  WESTEN_BACKUP="$IMG_DIR/westen_${TIMESTAMP}.jpg"
  SUEDEN_BACKUP="$IMG_DIR/sueden_${TIMESTAMP}.jpg"

  # Bild von der Kamera holen

  curl -k "https://192.168.100.128/cgi-bin/api.cgi?cmd=Snap&channel=0&rs=wuuPhkmUCeI9WG7C&user=admin&password=1MhasT69!" \
    --output "$WESTEN"
  
  curl -k "https://192.168.100.132/cgi-bin/api.cgi?cmd=Snap&channel=0&rs=wuuPhkmUCeI9WG7C&user=admin&password=1MhasT69!" \
    --output "$SUEDEN"
  
# Kopie mit Zeitstempel anlegen
  cp "$SUEDEN" "$SUEDEN_BACKUP"
  cp "$WESTEN" "$WESTEN_BACKUP"

  # Nur die 10 neuesten Bilder behalten
  ls -1t "$IMG_DIR"/westen_*.jpg | tail -n +$((MAX_BACKUPS + 1)) | xargs -r rm --
  ls -1t "$IMG_DIR"/sueden_*.jpg | tail -n +$((MAX_BACKUPS + 1)) | xargs -r rm --

  # Wartezeit
  sleep 2
done
