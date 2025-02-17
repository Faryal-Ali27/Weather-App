const apiKey = 'c0545b0a64755969f84dff3654cc9484';
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');
const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const weatherType = document.getElementById('weather-type');
const themeToggle = document.getElementById('theme-toggle');
const weatherContainer = document.getElementById('weather-container');
const forecastContainer = document.getElementById('forecast-container');
const forecastDiv = document.getElementById('forecast');

// Fetch weather data
async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    
    if (data.cod !== 200) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    alert(`Error: ${error.message}`);
    return null;
  }
}

// Fetch 5-day forecast
async function fetchForecast(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (data.cod !== "200") {
      throw new Error(data.message);
    }

    return data.list.filter((item, index) => index % 8 === 0); // Every 24 hours data
  } catch (error) {
    alert(`Error: ${error.message}`);
    return null;
  }
}

// Display weather data
function displayWeather(data) {
  if (!data) return;
  
  cityName.textContent = data.name;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  weatherType.textContent = data.weather[0].description;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherInfo.classList.remove('hidden');
}

// Display 5-day forecast
function displayForecast(data) {
  if (!data) return;
  
  forecastDiv.innerHTML = ""; // Clear previous data

  data.forEach(day => {
    const date = new Date(day.dt_txt).toLocaleDateString();
    const temp = `${Math.round(day.main.temp)}°C`;
    const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

    const forecastItem = `
      <div class="bg-white bg-opacity-20 p-4 rounded-lg text-center shadow-lg">
        <p class="text-lg font-bold">${date}</p>
        <img src="${icon}" class="w-12 h-12 mx-auto" alt="Weather Icon">
        <p class="text-lg">${temp}</p>
      </div>
    `;

    forecastDiv.innerHTML += forecastItem;
  });

  forecastContainer.classList.remove('hidden');
}

// Search button event listener
searchBtn.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  if (city) {
    const weatherData = await fetchWeather(city);
    const forecastData = await fetchForecast(city);
    
    displayWeather(weatherData);
    displayForecast(forecastData);
  } else {
    alert("Please enter a city name.");
  }
});

// Dark/Light mode toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('bg-blue-900');
  document.body.classList.toggle('text-white');
  weatherContainer.classList.toggle('bg-blue-800');

  if (document.body.classList.contains('bg-blue-900')) {
    themeToggle.innerHTML = '🌞';
  } else {
    themeToggle.innerHTML = '🌙';
  }

  localStorage.setItem('theme', document.body.classList.contains('bg-blue-900') ? 'dark' : 'light');
});

// Load theme preference
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('bg-blue-900', 'text-white');
    weatherContainer.classList.add('bg-blue-800', 'text-white');
    themeToggle.innerHTML = '🌞';
  }
});
