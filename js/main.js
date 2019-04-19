// 1 - Get user location in userData
// 2 - Get weather by user location
// 3 - Render it
let APPID = "9a0a7a73f232c11bb0c3932262afde0c";
let temp;
let humidity;
let city;
let icon;
let country;
let windDirection;
let windSpeed;
let flag;

function updateByGeo(lat, lon) {
    let url = 'https://api.openweathermap.org/data/2.5/weather?' + 
        'lat=' + lat +  
        '&lon=' + lon +  
        '&APPID=' + APPID;
    sendRequest(url);
}

function updateByCity(cityName) {
    let url = 'https://api.openweathermap.org/data/2.5/weather?' + 
        'q=' + cityName +  
        '&APPID=' + APPID;
    sendRequest(url);
}

function sendRequest(url) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let data = JSON.parse(xhr.responseText);
            let weather = {};
            weather.city = data.name;
            weather.temp = kelvinToCelsius(data.main.temp);
            weather.countryName = data.sys.country;
            weather.icon = data.weather[0].icon;
            weather.windSpeed = data.wind.speed;
            weather.windDirection = degreesToDirection(data.wind.deg);
            weather.humidity = data.main.humidity;
            weather.flag = null;
            console.log(data)

            update(weather);
        }
    }
    xhr.open('GET', url, true);
    xhr.send();
}

function kelvinToCelsius(k) {
    return Math.round(k - 273.15);
}

function degreesToDirection(deg) {
    let range = 360 / 8;
    let low = 0 - range/2;
    let high = (low + range) % 360;
    let angles = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    for ( let i in angles) {
        if ( deg >= low && deg < high ) {
            return angles[i];
        }
        low = (low + range) % 360;
        high = (high + range) % 360;
    }
}

function update(weather) {
    temp.innerHTML = weather.temp;
    humidity.innerHTML = weather.humidity;
    city.innerHTML = weather.city;
    country.innerHTML = weather.countryName;
    windDirection.innerHTML = weather.windDirection;
    windSpeed.innerHTML = weather.windSpeed;
    flag.src = 'http://openweathermap.org/images/flags/' + weather.countryName.toLowerCase() + '.png';
    icon.src = 'http://openweathermap.org/img/w/' + weather.icon + '.png';
}

function showPosition(position) {
    updateByGeo(position.coords.latitude, position.coords.longitude);
}

window.onload = function() {
    flag = document.querySelector('.user-flag > img');
    city = document.querySelector('.user-city');
    country = document.querySelector('.user-country');
    temp = document.getElementById('temperature');
    humidity = document.getElementById('humidity');
    windDirection = document.getElementById('wind-direction');
    windSpeed = document.getElementById('wind');
    icon = document.querySelector('.weather-icon > img');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        let userCity = window.prompt('Could not discover your location. What is your city? (for example: Kharkiv, Leipzig, Kiev)');

        updateByCity(userCity);
    }

}
