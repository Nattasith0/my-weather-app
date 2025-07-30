const apiKey = '34095bbd60758d439d90e6ec67a1901e';

const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const weatherInfoContainer = document.querySelector('#weather-info-container');

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const cityName = cityInput.value.trim();

    if (cityName) {
        getWeather(cityName);
    } else {
        alert('กรุณาป้อนชื่อเมือง');
    }
});

async function getWeather(city) {
    weatherInfoContainer.innerHTML = `<p>กำลังโหลดข้อมูล...</p>`;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=th`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('ไม่พบข้อมูลเมืองนี้');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        weatherInfoContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

function displayWeather(data) {
    const { name, main, weather } = data;
    const { temp, humidity } = main;
    const { description, icon } = weather[0];

    const weatherHtml = `
        <h2 class="text-2xl font-bold">${name}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p class="temp">${temp.toFixed(1)}°C</p>
        <p>${description}</p>
        <p>ความชื้น: ${humidity}%</p>
    `;
    weatherInfoContainer.innerHTML = weatherHtml;
}

function applyWeatherTheme(data) {
    const isDay = data.weather[0].icon.includes('d');
    const temp = data.main.temp;

    let themeClass = '';

    if (isDay) {
        if (temp >= 30) {
            themeClass = 'hot-day';
        } else if (temp <= 20) {
            themeClass = 'cold-day';
        } else {
            themeClass = 'mild-day';
        }
    } else {
        themeClass = 'night';
    }

    document.body.className = '';
    document.body.classList.add(themeClass);
}
function displayWeather(data) {
    applyWeatherTheme(data); 

    const { name, main, weather } = data;
    const { temp, humidity } = main;
    const { description, icon } = weather[0];

    const weatherHtml = `
        <h2 class="text-2xl font-bold">${name}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p class="temp">${temp.toFixed(1)}°C</p>
        <p>${description}</p>
        <p>ความชื้น: ${humidity}%</p>
    `;
    weatherInfoContainer.innerHTML = weatherHtml;
}
async function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=th`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('ไม่พบข้อมูลพยากรณ์ล่วงหน้า');
        }
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.error(error);
    }
}
function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    if (!forecastContainer) return;

    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    let html = '<h3>พยากรณ์อากาศล่วงหน้า</h3><div class="forecast-cards">';

    dailyForecasts.forEach(item => {
        const date = new Date(item.dt * 1000);
        const options = { weekday: 'short', day: 'numeric', month: 'short' };
        const dateString = date.toLocaleDateString('th-TH', options);
        const temp = item.main.temp.toFixed(1);
        const description = item.weather[0].description;
        const icon = item.weather[0].icon;

        html += `
            <div class="forecast-card">
                <p class="forecast-date">${dateString}</p>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
                <p class="forecast-temp">${temp}°C</p>
                <p class="forecast-desc">${description}</p>
            </div>
        `;
    });

    html += '</div>';
    forecastContainer.innerHTML = html;
}
async function getWeather(city) {
    weatherInfoContainer.innerHTML = `<p>กำลังโหลดข้อมูล...</p>`;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=th`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('ไม่พบข้อมูลเมืองนี้');
        }
        const data = await response.json();
        displayWeather(data);

        getForecast(city);

    } catch (error) {
        weatherInfoContainer.innerHTML = `<p class="error">${error.message}</p>`;
        document.getElementById('forecast-container').innerHTML = ''; 
    }
}
