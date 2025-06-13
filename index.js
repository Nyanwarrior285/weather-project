const API_URL = "https://api.met.no/weatherapi/locationforecast/2.0/compact?";
const lat = document.getElementById("latitude");
const lng = document.getElementById("longitude");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const map = document.getElementById("map");
map.src = "";


const values = {
  temp: 0,
  humidity: 0,
  windSpeed: 0
}
const units = {
  temp: "celsius",
  humidity: "%",
  windSpeed: "m/s"
}

function checkNegative(string) {
  if (string[0] !== "-") {
    return {negative: true, string: string};
  } else {
    return {negative: false, string: string.slice(1)};
  }
}

function getRandomLatLng() {
  const lat = Math.random() * 180 - 90;
  const lng = Math.random() * 360 - 180;
  return { latitude: lat.toFixed(2), longitude: lng.toFixed(2) };
}

async function getWeatherData(lat, lng) {
  const url = `${API_URL}lat=${lat}&lon=${lng}`;
  const response = await fetch(url);
  return response.json();
}

async function main() {
  const latLng = getRandomLatLng();
  const response = await getWeatherData(latLng.latitude, latLng.longitude);
  console.log(response);
  values.temp = response.properties.timeseries[0].data.instant.details.air_temperature;
  values.humidity = response.properties.timeseries[0].data.instant.details.relative_humidity;
  values.windSpeed = response.properties.timeseries[0].data.instant.details.wind_speed;
  units.temp = response.properties.meta.units.air_temperature;
  units.humidity = response.properties.meta.units.relative_humidity;
  units.windSpeed = response.properties.meta.units.wind_speed;
  const checkLat = checkNegative(latLng.latitude);
  const checkLng = checkNegative(latLng.longitude);

  map.src = `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(latLng.longitude) - 0.5}%2C${parseFloat(latLng.latitude) - 0.5}%2C${parseFloat(latLng.longitude) + 0.5}%2C${parseFloat(latLng.latitude) + 0.5}&marker=${parseFloat(latLng.latitude)}%2C${parseFloat(latLng.longitude)}&zoom=16&layers=T&theme=transport`;
  
  console.log(checkLng, checkLat);
  
  if (checkLat["negative"]) {
    lat.innerHTML = `${checkLat["string"]}° N`;
  } else{
    lat.innerHTML = `${checkLat["string"]}° S`;
  }

  if (!checkLng["negative"]) {
    lng.innerHTML = `${checkLng["string"]}° W`;
  } else{
    lng.innerHTML = `${checkLng["string"]}° E`;
  }
  
  
  temp.innerHTML = `${values.temp}° ${units.temp}`;
  humidity.innerHTML = `${values.humidity} ${units.humidity} humidity`;
  windSpeed.innerHTML = `${values.windSpeed} ${units.windSpeed} wind speed`;
}

main();