//Today's date:

function formatTodaysDate() {
  let today = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[today.getDay()];

  let hour = today.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = today.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day} ${hour}:${minutes}`;
}

//Search for a specific city
function newCity(city) {
  let unit = "metric";
  let apiUrlTempCity = getUrl(unit, city);
  axios
    .get(apiUrlTempCity)
    .then(changeTempUnitToC)
    .catch(getRequestHandleError);
}

function searchForCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  newCity(city);
}

//See current city (and temperature)
function showCurrentCity(response) {
  let city = response.data[0].name;
  newCity(city);
}

function showPosition(position) {
  let apiKey = "ef3ec2d20b89f88c543aa39d79e10d92";
  let apiUrlCurrentCity = `https://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}`;
  axios
    .get(apiUrlCurrentCity)
    .then(showCurrentCity)
    .catch(getRequestHandleError);
}

function seeCurrentCity(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

//Change temperature from one unit to another:
function changeTempUnitToF(response) {
  changeTempUnit(`F`, response);

  let windSpeed = Math.round(response.data.wind.speed);
  document.querySelector("#wind-speed").innerHTML = `${windSpeed} mph`;

  //document.querySelector("#temp-c").innerHTML = `°C`;
  //document.querySelector("#temp-f").innerHTML = `<strong>°F</strong>`;
}

function changeTempUnitToC(response) {
  changeTempUnit(`C`, response);

  let windSpeed = Math.round(response.data.wind.speed * 3.6);
  document.querySelector("#wind-speed").innerHTML = `${windSpeed} km/h`;

  //document.querySelector("#temp-c").innerHTML = `<strong>°C</strong>`;
  //document.querySelector("#temp-f").innerHTML = `°F`;
}

function changeTempUnit(tempUnit, response) {
  document.querySelector("#temperature-today").innerHTML = Math.round(
    response.data.main.temp
  );

  let maxTemperature = Math.round(response.data.main.temp_max);
  document.querySelector(
    "#max-temp"
  ).innerHTML = `${maxTemperature}°${tempUnit}`;

  let minTemperature = Math.round(response.data.main.temp_min);
  document.querySelector(
    "#min-temp"
  ).innerHTML = `${minTemperature}°${tempUnit}`;

  let humidity = response.data.main.humidity;
  document.querySelector("#humidity").innerHTML = `${humidity}%`;

  document
    .querySelectorAll(".temp-units span")
    .forEach((elem) => (elem.style.fontWeight = "normal"));
  document.querySelector(`#temp-${tempUnit.toLowerCase()}`).style.fontWeight =
    "bold";
}

function getUrl(unit, city) {
  document.querySelector("#chosen-city").innerHTML = city;
  let apiKey = "ef3ec2d20b89f88c543aa39d79e10d92";
  return `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
}

function changeToCelsius(event) {
  event.preventDefault();
  let city = document.querySelector("#chosen-city").innerHTML;
  let unit = "metric";
  let apiUrlNewTemp = getUrl(unit, city);
  axios.get(apiUrlNewTemp).then(changeTempUnitToC).catch(getRequestHandleError);
}

function changeToFahrenheit(event) {
  event.preventDefault();
  let city = document.querySelector("#chosen-city").innerHTML;
  let unit = "imperial";
  let apiUrlNewTemp = getUrl(unit, city);
  axios.get(apiUrlNewTemp).then(changeTempUnitToF).catch(getRequestHandleError);
}

function getRequestHandleError(error) {
  alert(error);
}

//inputs
let dateNow = document.querySelector("#date-today");
dateNow.innerHTML = formatTodaysDate();

let tempCelsius = document.querySelector("#temp-c");
tempCelsius.addEventListener("click", changeToCelsius);

let tempFahrenheit = document.querySelector("#temp-f");
tempFahrenheit.addEventListener("click", changeToFahrenheit);

window.onload = changeToCelsius;

let currentCity = document.querySelector("#current-city-button");
currentCity.addEventListener("click", seeCurrentCity);

let cityInput = document.querySelector("#city-search-form");
cityInput.addEventListener("submit", searchForCity);
