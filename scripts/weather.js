import { degToCompass } from './utils.js';

const apiKey = "6727e6ab6df77e54745cbb646e8d8668";
const cityId = 2810188;

export async function fetchWeather() {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${apiKey}&units=metric&lang=de`);
  const data = await res.json();
  return data;
}

export function updateWeatherUI(data) {
  const current = data.list[0];
  const wind = current.wind.speed;
  const clouds = current.clouds.all;
  const weather = current.weather[0].main.toLowerCase();
  const windDeg = current.wind.deg || 0;
  const windDirectionText = degToCompass(windDeg);

  const wetterbox = document.getElementById("wetterbox");
  if (!wetterbox) return;

  let html = `
    🌡 Temperatur: ${current.main.temp} °C<br>
    📈 Luftdruck: ${current.main.pressure} hPa<br>
    💧 Luftfeuchtigkeit: ${current.main.humidity} %<br>
    🌬 Wind: ${wind} m/s<br>
    🧭 Windrichtung: ${windDeg}° (${windDirectionText})<br>
    ☁️ Wolken: ${clouds} %<br>
    🌤 Zustand: ${current.weather[0].description}<br><br>
    <strong>Vorhersage:</strong><br>
  `;
  for (let i = 1; i <= 2; i++) {
    const fc = data.list[i];
    const time = new Date(fc.dt * 1000).toLocaleTimeString("de-DE", {
      hour: "2-digit", minute: "2-digit"
    });
    html += `🕒 ${time} – ${fc.main.temp} °C, ${fc.weather[0].description}<br>`;
  }
  wetterbox.innerHTML = html;
}

