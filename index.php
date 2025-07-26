<?php
// Serverzeit für Liveanzeige
$zeit = date("H:i:s");

// Optional: letzter Bildzeitstempel (wenn existiert)
$westen = "bilder/westen.jpg";
$sueden = "bilder/sueden.jpg";
?>
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Webcams – Sebastian Selle</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#007acc">

  <!-- Styles & Scripts -->
  <link rel="stylesheet" href="styles/main.css">
  <script type="module" src="scripts/main.js" defer></script>

  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <script src="https://unpkg.com/leaflet-semicircle"></script>
  <script src="https://unpkg.com/suncalc/suncalc.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
</head>
<body>

<header>
  <h1>Live-Webcams – Sebastian Selle</h1>
</header>

<div class="container">

  <div class="webcam-card">
    <h2>Modern Next GmbH – Blick nach Westen</h2>
    <div class="timestamp" id="zeit1">Aktuelle Uhrzeit (Server): <?= $zeit ?></div>
    <div class="bild-wrapper">
      <img src="<?= $westen ?>?t=<?= time() ?>" alt="Webcam Westen" id="webcam1" class="webcam-image">
    </div>

    <div class="row">
      <div class="column">
        <h3>Karte (Blickrichtung & Wind)</h3>
        <div id="map"></div>
      </div>
      <div class="column">
        <h3>Wetter in Westerstede</h3>
        <div id="wetterbox" class="info-box">Wetterdaten werden geladen…</div>
        <div id="flugbox" class="klassifizierung-box"></div>
        <div id="sonnebox" class="info-box">Sonneninfos werden geladen…</div>
      </div>
    </div>
  </div>

  <div class="webcam-card">
    <h2>Modern Next GmbH – Blick nach Süden</h2>
    <div class="timestamp" id="zeit2">Aktuelle Uhrzeit (Server): <?= $zeit ?></div>
    <div class="bild-wrapper">
      <img src="<?= $sueden ?>?t=<?= time() ?>" alt="Webcam Süden" id="webcam2" class="webcam-image">
    </div>
  </div>


  <div class="webcam-card">
    <h2>Archiv – Blick nach Westen (stündlich)</h2>
    <p>Die letzten Webcam-Bilder der letzten Stunden.</p>

    <div class="gallery">
      <?php
        $archivPfad = "bilder/static/archive";
        $bilder = glob($archivPfad . "/*.jpg");
        rsort($bilder); // neueste zuerst

        // Maximal 24 Bilder anzeigen (1 Tag)
        $bilder = array_slice($bilder, 0, 24);

        foreach ($bilder as $bild) {
          $dateiname = basename($bild);
          echo "<img src='$bild' alt='$dateiname'>";
        }
      ?>
    </div>
  </div>

</div>
<footer>
  © Sebastian Selle · webcam.sebastian-selle.de
</footer>

</body>
</html>

