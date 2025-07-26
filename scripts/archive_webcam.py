import requests
from datetime import datetime
import os

# Konfiguration
WEBCAM_URL = "https://webcam.sebastian-selle.de/bilder/westen.jpg"
ARCHIVE_DIR = "../bilder/static/archive"

def ensure_directory(path):
    os.makedirs(path, exist_ok=True)

def download_webcam_image(url, save_dir):
    timestamp = datetime.now().strftime("%Y-%m-%d_%H.jpg")
    filepath = os.path.join(save_dir, timestamp)

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        with open(filepath, "wb") as f:
            f.write(response.content)
        print(f"[OK] Gespeichert: {filepath}")
    except Exception as e:
        print(f"[FEHLER] Beim Abrufen oder Speichern: {e}")

def main():
    ensure_directory(ARCHIVE_DIR)
    download_webcam_image(WEBCAM_URL, ARCHIVE_DIR)

if __name__ == "__main__":
    main()

