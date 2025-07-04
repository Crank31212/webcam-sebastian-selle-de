// flightConditions.js

export function updateFlightConditions(current) {
  const wind = current.wind.speed;
  const clouds = current.clouds.all;
  const weather = current.weather[0].main.toLowerCase();

  const flugbox = document.getElementById("flugbox");
  if (!flugbox) return;

  let flug = "C", flugIcon = "🔴", flugText = "Nicht geeignet zum Fliegen. Grund: ";
  let fs = "C", fsIcon = "🔴", fsText = "Nicht geeignet zum Springen. Grund: ";

  if (clouds < 60 && wind <= 6 && !weather.includes("rain")) {
    flug = "A"; flugIcon = "🟢";
    flugText = "Optimale Bedingungen: wenig Wolken, ruhiger Wind, kein Niederschlag.";
  } else if (clouds < 80 && wind <= 8) {
    flug = "B"; flugIcon = "🟡";
    flugText = "Maessige Bedingungen: erhoehte Bewoelkung oder auffrischender Wind.";
  } else {
    if (clouds >= 80) flugText += "starke Bewoelkung, ";
    if (wind > 8) flugText += "Wind > 8 m/s, ";
    if (weather.includes("rain")) flugText += "Regen.";
  }

  if (wind <= 4 && clouds < 40) {
    fs = "A"; fsIcon = "🟢";
    fsText = "Sehr gute Bedingungen zum Springen: ruhiger Wind, klare Sicht.";
  } else if (wind <= 6 && clouds < 70) {
    fs = "B"; fsIcon = "🟡";
    fsText = "Bedingt moeglich: leichter Wind oder bewoelkter Himmel.";
  } else {
    if (wind > 6) fsText += "Wind > 6 m/s, ";
    if (clouds >= 70) fsText += "dichte Bewoelkung, ";
    if (weather.includes("rain")) fsText += "Regen.";
  }

  flugbox.innerHTML = `
    <div class="klassifizierung">
      <h4>🛩️ Fliegen: <strong>${flug}</strong> ${flugIcon}</h4>
      <p class="klassifizierung-erklaerung">${flugText}</p>
    </div>
    <div class="klassifizierung">
      <h4>🪂 Fallschirmsprung: <strong>${fs}</strong> ${fsIcon}</h4>
      <p class="klassifizierung-erklaerung">${fsText}</p>
    </div>
  `;
}

