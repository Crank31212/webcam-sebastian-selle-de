import { movePoint } from './utils.js';

export function initMap(lat, lng) {
  const map = L.map("map").setView([lat, lng], 17);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);
  return map;
}

export function drawCameraView(map, lat, lng, direction, color) {
  L.semiCircle([lat, lng], {
    radius: 100,
    startAngle: direction - 87 / 2,
    stopAngle: direction + 87 / 2,
    color,
    fillColor: color,
    fillOpacity: 0.4
  }).addTo(map);
}



// Start- und Endpunkt der Linie
const startLatLng = [53.2848, 7.8915];
const windDeg = 295; // aktueller Windwinkel in Grad (wie auf Bild)
const distance = 150; // Länge der Linie in Metern

// movePoint-Funktion wie vorher definiert (um Punkt in Meter und Grad zu verschieben)
function movePoint(lat, lng, dist, bearing) {
  const R = 6378137; // Erdradius in Meter
  const brng = bearing * Math.PI / 180;
  const lat1 = lat * Math.PI / 180;
  const lng1 = lng * Math.PI / 180;

  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist / R) +
                         Math.cos(lat1) * Math.sin(dist / R) * Math.cos(brng));
  const lng2 = lng1 + Math.atan2(Math.sin(brng) * Math.sin(dist / R) * Math.cos(lat1),
                                 Math.cos(dist / R) - Math.sin(lat1) * Math.sin(lat2));

  return [lat2 * 180 / Math.PI, lng2 * 180 / Math.PI];
}

// Endpunkt der Linie bestimmen
const endLatLng = movePoint(startLatLng[0], startLatLng[1], distance, (windDeg + 180) % 360);

// Linie zeichnen
const windLine = L.polyline([startLatLng, endLatLng], { color: 'blue', weight: 3 }).addTo(map);

// Erzeuge Pfeil-Marker am Startpunkt
const arrowIcon = L.divIcon({
  className: 'wind-arrow-icon',
  html: '🡢',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const arrowMarker = L.marker(startLatLng, { icon: arrowIcon }).addTo(map);

// Animation: Pfeil bewegt sich von start zu ende der Linie
let progress = 0;
const steps = 120;
const stepSize = 1 / steps;

function animateArrow() {
  progress += stepSize;
  if (progress > 1) progress = 0;

  // Position interpolieren
  const lat = startLatLng[0] + (endLatLng[0] - startLatLng[0]) * progress;
  const lng = startLatLng[1] + (endLatLng[1] - startLatLng[1]) * progress;
  arrowMarker.setLatLng([lat, lng]);

  // Pfeil in Windrichtung drehen (Wind kommt aus windDeg, Pfeil zeigt wohin er weht)
  const rotation = (windDeg + 180) % 360;
  const el = arrowMarker.getElement();
  if (el) {
    el.style.transform = `rotate(${rotation}deg)`;
  }

  requestAnimationFrame(animateArrow);
}

animateArrow();
















export function animateWindFlow(map, startLatLng, windDeg, camDir) {
  const distance = 150;
  const endLatLng = movePoint(startLatLng[0], startLatLng[1], distance, (windDeg + 180) % 360);

  const line = L.polyline([startLatLng, endLatLng], { color: 'blue', weight: 3 }).addTo(map);

  const arrowIcon = L.divIcon({
    className: 'wind-arrow-icon',
    html: '🡢',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  const marker = L.marker(startLatLng, { icon: arrowIcon }).addTo(map);

  let progress = 0;
  const steps = 100;
  const stepSize = 1 / steps;

  function step() {
    progress += stepSize;
    if (progress > 1) progress = 0;

    const lat = startLatLng[0] + (endLatLng[0] - startLatLng[0]) * progress;
    const lng = startLatLng[1] + (endLatLng[1] - startLatLng[1]) * progress;

    marker.setLatLng([lat, lng]);

    const relativeAngle = (windDeg - camDir + 360) % 360;
    const arrowAngle = (relativeAngle + 180) % 360;
    const angleCorrection = 0;
    const finalAngle = (arrowAngle + angleCorrection) % 360;

    const markerEl = marker.getElement();
    if (markerEl) {
      markerEl.style.transform = `rotate(${finalAngle}deg)`;
    }

    requestAnimationFrame(step);
  }

  step();
}

