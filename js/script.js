// functions url api
function getUrlCurrent(unit, city) {
  let apiKey = "b60aa360b0014o44b220b7at7697f3da";
  return `https://api.shecodes.io/weather/v1/current?query=${city}&units=${unit}&key=${apiKey}`;
}

function getUrlCurrentWithCoord(position) {
  let apiKey = "b60aa360b0014o44b220b7at7697f3da";
  return `https://api.shecodes.io/weather/v1/current?lat=${position.coords.latitude}&lon=${position.coords.longitude}&key=${apiKey}`;
}

function getUrlForecast(unit, city) {
  let apiKey = "b60aa360b0014o44b220b7at7697f3da";
  return `https://api.shecodes.io/weather/v1/forecast?query=${city}&units=${unit}&key=${apiKey}`;
}

function getUrlForecastWithCoord(position) {
  let apiKey = "b60aa360b0014o44b220b7at7697f3da";
  return `https://api.shecodes.io/weather/v1/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&key=${apiKey}`;
}

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

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

//forecast HTML and search
function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col">
        <div class="weather-forecast-date">${formatForecastDay(
          forecastDay.time
        )}</div>
        <div class="card weather-emoji-card">
          <img src="images/${forecastDay.condition.icon}.svg" alt="${
          forecastDay.condition.icon
        }" />
        </div>
        <div class="weather-forecast-temperature">
          <span class="weather-forecast-temperature-max"
          ><strong>${Math.round(
            forecastDay.temperature.maximum
          )}°</strong></span
          >
          | <span class="weather-forecast-temperature-min">${Math.round(
            forecastDay.temperature.minimum
          )}°</span>
        </div>
      </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//Search for a specific city
function showNewCity(city) {
  let unit = "metric";
  let apiUrlForecast = getUrlForecast(unit, city);
  let apiUrlCurrent = getUrlCurrent(unit, city);
  axios
    .get(apiUrlCurrent)
    .then(changeCurrentTempUnitToC)
    .catch(getRequestHandleError);
  axios.get(apiUrlForecast).then(displayForecast).catch(getRequestHandleError);
}

function searchForCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  if (city.match(RegExp("^([a-zA-Z]+ ?)+$"))) {
    showNewCity(city);
  } else {
  }
}

//See current city (and temperature)
function searchCurrentCity(response) {
  let city = response.data.city;
  showNewCity(city);
}

function showPosition(position) {
  let apiUrlCurrentCity = getUrlForecastWithCoord(position);
  axios
    .get(apiUrlCurrentCity)
    .then(searchCurrentCity)
    .catch(getRequestHandleError);
}

function seeCurrentCity(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

//Change Current temperature from one unit to another:
function changeCurrentTempUnitToC(response) {
  if (response.data.status === "not_found") {
    alert("Is the city written correctly?");
  } else {
    document.querySelector("#chosen-city").innerHTML = response.data.city;
    changeTempUnit(`C`, response);

    let windSpeed = Math.round(response.data.wind.speed * 3.6);
    document.querySelector("#wind-speed").innerHTML = `${windSpeed} km/h`;
  }
}

function changeCurrentTempUnitToF(response) {
  changeTempUnit(`F`, response);

  let windSpeed = Math.round(response.data.wind.speed);
  document.querySelector("#wind-speed").innerHTML = `${windSpeed} mph`;
}

function changeTempUnit(tempUnit, response) {
  console.log(response.data);
  document
    .querySelector("#weather-emoji-today")
    .setAttribute("src", `images/${response.data.condition.icon}.svg`);

  document.querySelector("#temperature-today").innerHTML = Math.round(
    response.data.temperature.current
  );

  document.querySelector("#temperature-feels-like").innerHTML = `${Math.round(
    response.data.temperature.feels_like
  )}°${tempUnit}`;

  document.querySelector("#description-today").innerHTML =
    response.data.condition.description;

  let humidity = response.data.temperature.humidity;
  document.querySelector("#humidity").innerHTML = `${humidity}%`;

  document
    .querySelectorAll(".temp-units span")
    .forEach((elem) => (elem.style.fontWeight = "normal"));
  document.querySelector(`#temp-${tempUnit.toLowerCase()}`).style.fontWeight =
    "bold";
}

function changeToCelsius(event) {
  event.preventDefault();
  let city = document.querySelector("#chosen-city").innerHTML;
  let unit = "metric";
  let apiUrlForecastTemp = getUrlForecast(unit, city);
  let apiUrlCurrent = getUrlCurrent(unit, city);
  axios
    .get(apiUrlCurrent)
    .then(changeCurrentTempUnitToC)
    .catch(getRequestHandleError);
  axios
    .get(apiUrlForecastTemp)
    .then(displayForecast)
    .catch(getRequestHandleError);
}

function changeToFahrenheit(event) {
  event.preventDefault();
  let city = document.querySelector("#chosen-city").innerHTML;
  let unit = "imperial";
  let apiUrlForecastTemp = getUrlForecast(unit, city);
  let apiUrlCurrent = getUrlCurrent(unit, city);
  axios
    .get(apiUrlCurrent)
    .then(changeCurrentTempUnitToF)
    .catch(getRequestHandleError);
  axios
    .get(apiUrlForecastTemp)
    .then(displayForecast)
    .catch(getRequestHandleError);
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
