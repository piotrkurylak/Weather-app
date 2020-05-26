// API KEY: 346a40dea7b99a36f7f60113c56b1237


// GET OUR ELEMENTS

const temperatureElement = document.querySelector('.weather__value');
const iconElement = document.querySelector('.weather__photo');
const descriptionElement = document.querySelector('.weather__description');
const locationElement = document.querySelector('.weather__location');
const notificationElement = document.querySelector('.notification');
const weatherElement = document.querySelector('.weather');


// CHANGE BACKGROUND DEPENDING ON THE TIME OF DAY

setInterval(changeBackground, 1000 * 60 * 1);

function changeBackground() {
    const date = new Date();
    const hour = date.getHours();
    if (hour > 18 || hour < 6) {
        document.body.classList.add('night');
        weatherElement.style.boxShadow = '5px 5px 62px 0px rgba(1,20,102,1)';
        weatherElement.style.backgroundImage = 'url(icons/night-background.png)';



    } else {
        document.body.classList.add('day');
        weatherElement.style.boxShadow = '5px 5px 62px 0px rgba(141,76,18,1)';
        weatherElement.style.backgroundImage = 'url(icons/day-background.png)';
    }
}

changeBackground();


// APP DATA


const weather = {};

weather.temperature = {
    unit: 'celcius'
}

// APP CONSTS AND VARIABLES

const kelvinUnit = 273;
const apiKey = '346a40dea7b99a36f7f60113c56b1237';

// CHECK IF BROWSER SUPPORT GEOLOCATION

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = "<p>Browser doesn't support Geolocation!</p>";
}

// SET USER POSITION

function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE

function showError(error) {
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = `<p>${error.message}</p>`
}


// GET WEATHER FROM API PROVIDER

function getWeather(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            weather.temperature.value = Math.floor(data.main.temp - kelvinUnit);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function () {
            displayWeather();
        })
}

// DISPLAY WEATHER TO UI
function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    temperatureElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descriptionElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// C to F conversion
function celsiusToFahrenheit(temperature) {
    return (temperature * 9 / 5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
temperatureElement.addEventListener("click", function () {
    if (weather.temperature.value === undefined) return;

    if (weather.temperature.unit == "celsius") {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        temperatureElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    } else {
        temperatureElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"

    }
});