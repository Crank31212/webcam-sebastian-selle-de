// main.js
import { degToCompass, movePoint } from './utils.js';
import { initMap, drawCameraView, animateWindFlow } from './map.js';
import { fetchWeather, updateWeatherUI } from './weather.js';
import { updateFlightConditions } from './flightConditions.js';

const camLat = 53.284800;
const camLng = 7.891477;
const camDirections = { west: 270, south: 180 };

function updateTime() {
  const now = new Date().toLocaleTimeString("de-DE", {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  document.getElementById("zeit1").textContent = "Aktuelle Uhrzeit: " + now;
  document.getElementById("zeit2").textContent = "Aktuelle Uhrzeit: " + now;
}

setInterval(updateTime, 1000);
updateTime();

setInterval(() => {
  const ts = Date.now();
  const w1 = document.getElementById("webcam1");
  const w2 = document.getElementById("webcam2");
  if (w1) w1.src = `bilder/latest.jpg?t=${ts}`;
  if (w2) w2.src = `bilder/unterwegs.jpg?t=${ts}`;
}, 2000);

async function main() {
  const map = initMap(camLat, camLng);
  drawCameraView(map, camLat, camLng, camDirections.west, "#007acc");
  drawCameraView(map, camLat, camLng, camDirections.south, "#cc7700");
  L.marker([camLat, camLng]).addTo(map).bindPopup("Modern Next GmbH – 2 Kameras");

  try {
    const weatherData = await fetchWeather();
    updateWeatherUI(weatherData);
    updateFlightConditions(weatherData.list[0]);

    const windDeg = weatherData.list[0].wind.deg || 0;

    animateWindFlow(map, [camLat, camLng], windDeg, camDirections.west);
    // animateWindFlow(map, [camLat, camLng], windDeg, camDirections.south); // falls andere Koordinaten

  } catch (err) {
    console.error("Fehler beim Laden der Wetterdaten:", err);
    const wetterbox = document.getElementById("wetterbox");
    if (wetterbox) wetterbox.textContent = "Wetterdaten konnten nicht geladen werden.";
  }
}

main();

