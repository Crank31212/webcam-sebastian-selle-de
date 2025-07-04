// map.js
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

    marker.getElement().style.transform = `rotate(${finalAngle}deg)`;

    requestAnimationFrame(step);
  }

  step();
}

