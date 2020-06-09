// API KEY: 346a40dea7b99a36f7f60113c56b1237


// GET OUR ELEMENTS

const temperatureElement = document.querySelector('.weather__temperature');
const iconElement = document.querySelector('.weather__photo');
const descriptionElement = document.querySelector('.weather__description');
const locationElement = document.querySelector('.weather__location');
const notificationElement = document.querySelector('.notification');
const weatherElement = document.querySelector('.weather');
const dateContainerElement = document.querySelector('.weather__date-container');
const timeElement = document.querySelector('.weather__time');
const dateElement = document.querySelector('.weather__date');
const forecastDayElement = document.querySelector('.weather__days');
const weatherIconsElement = document.querySelector('.weather__icons');
const weatherTemperaturesElement = document.querySelector('.weather__temperatures');




// APP DATA


const weather = {};

weather.temperature = {
    unit: 'celcius'
}

// APP VARIABLES

const kelvinUnit = 273;
const apiKey = '346a40dea7b99a36f7f60113c56b1237';
const apiKey2 = '39782423ace6fe2f7a89b4e83f1360e0';


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
    getWeather2(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE

function showError(error) {
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = `<p>${error.message}</p>`
    dateContainerElement.style.display = `none`;
    timeElement.style.display = `none`;
    dateElement.style.display = `none`;

}




// GET WEATHER FROM API PROVIDER

function getWeather2(latitude, longitude) {
    let api2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={part}&appid=${apiKey}`


    fetch(api2)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            weather.days = data.daily;
            weather.temperature.value = Math.floor(data.daily[0].temp.day - kelvinUnit);
            weather.description = data.daily[0].weather[0].description;
            weather.iconId = data.daily[0].weather[0].icon;
            weather.days.pop();
            weather.days.forEach(function (day) {
                const date = new Date(day.dt * 1000);
                weather.days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const nameOfDay = weather.days[date.getDay()];
                const icon = day.weather[0].icon;
                const tempOfDay = Math.floor(day.temp.day - kelvinUnit);
                const daysOfWeek = document.createElement(`p`);
                daysOfWeek.innerHTML = `${nameOfDay}`;
                forecastDayElement.appendChild(daysOfWeek);
                const tempofWeek = document.createElement(`p`);
                tempofWeek.innerHTML = `${tempOfDay}ºC`;
                weatherTemperaturesElement.appendChild(tempofWeek);
                const iconOfDay = document.createElement(`figure`);
                iconOfDay.className = 'weather__photo';
                if (document.body.classList.contains('day')) {
                    iconOfDay.innerHTML = `<img src="icons/black32px/${icon}.png"/>`;

                    weatherIconsElement.appendChild(iconOfDay);
                } else {
                    iconOfDay.innerHTML = `<img src="icons/white32px/${icon}.png"/>`;
                    weatherIconsElement.appendChild(iconOfDay);
                }


            })
        })
        .then(function () {
            displayWeather();
        })
}







function getWeather(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function () {
            displayWeather();
        })
}


// DISPLAY WEATHER TO UI
function displayWeather() {
    if (document.body.classList.contains('day')) {
        iconElement.innerHTML = `<img src="icons/black/${weather.iconId}.png"/>`;
        temperatureElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        descriptionElement.innerHTML = weather.description;
        locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    } else {
        iconElement.innerHTML = `<img src="icons/white/${weather.iconId}.png"/>`;
        temperatureElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        descriptionElement.innerHTML = weather.description;
        locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    }
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

        temperatureElement.innerHTML = `${fahrenheit}°F`;
        weather.temperature.unit = "fahrenheit";
    } else {
        temperatureElement.innerHTML = `${weather.temperature.value}°C`;
        weather.temperature.unit = "celsius"

    }
});



// CHANGE BACKGROUND DEPENDING ON THE TIME OF DAY

setInterval(updateBackground, 60000);
setInterval(updateDate, 1000);



function updateDate() {
    const date = new Date();
    const hour = date.getHours();
    let minute = date.getMinutes();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    let year = date.getFullYear();
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let nameOfDay = days[date.getDay()];
    dateElement.innerHTML = `${day}/${month}/${year}`
    if (minute < 10) {
        minute = `0` + minute;
        timeElement.innerHTML = `${nameOfDay}, ${hour}:${minute}`;
    } else {
        timeElement.innerHTML = `${nameOfDay}, ${hour}:${minute}`;
    }
}

updateDate();


function updateBackground() {
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
        document.body.style.color = '#000';




    }
}

updateBackground();