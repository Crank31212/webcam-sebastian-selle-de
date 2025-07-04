#!/bin/bash

# Erwartet drei Bilder: img1.jpg, img2.jpg, img3.jpg im gleichen Verzeichnis
# Optional: Übergib Dateinamen als Argumente

IMG1="${1:-img1.jpg}"
IMG2="${2:-img2.jpg}"
IMG3="${3:-img3.jpg}"

# Schritt 1: Differenzbilder erzeugen mit imagemagick
convert "$IMG2" "$IMG1" -compose difference -composite diff1.jpg
convert "$IMG3" "$IMG2" -compose difference -composite diff2.jpg

# Schritt 2: Python-Analyse aufrufen
python3 analyze_motion.py diff1.jpg diff2.jpg

