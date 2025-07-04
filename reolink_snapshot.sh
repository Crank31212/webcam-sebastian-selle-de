#!/bin/bash

IMG_DIR="/var/www/html/webcam.sebastian-selle.de/bilder"
MAX_BACKUPS=10

while true; do
  TIMESTAMP=$(date +%s)
  LATEST="$IMG_DIR/latest.jpg"
  BACKUP="$IMG_DIR/webcam_${TIMESTAMP}.jpg"

  # Bild von der Kamera holen
  curl -k "https://192.168.100.128/cgi-bin/api.cgi?cmd=Snap&channel=0&rs=wuuPhkmUCeI9WG7C&user=admin&password=1MhasT69!" \
    --output "$LATEST"

  # Kopie mit Zeitstempel anlegen
  cp "$LATEST" "$BACKUP"

  # Nur die 10 neuesten Bilder behalten
  ls -1t "$IMG_DIR"/webcam_*.jpg | tail -n +$((MAX_BACKUPS + 1)) | xargs -r rm --

  # Wartezeit
  sleep 2
done
