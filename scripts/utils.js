// utils.js
export function degToCompass(num) {
  const directions = ["N","NNO","NO","ONO","O","OSO","SO","SSO","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  const val = Math.floor((num / 22.5) + 0.5) % 16;
  return directions[val];
}

export function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export function movePoint(lat, lng, distance, bearing) {
  const R = 6378.1 * 1000; // Erdradius in Meter
  const brng = deg2rad(bearing);
  const lat1 = deg2rad(lat);
  const lng1 = deg2rad(lng);

  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distance / R) +
               Math.cos(lat1) * Math.sin(distance / R) * Math.cos(brng));
  const lng2 = lng1 + Math.atan2(Math.sin(brng) * Math.sin(distance / R) * Math.cos(lat1),
                                Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2));

  return [lat2 * 180 / Math.PI, lng2 * 180 / Math.PI];
}

