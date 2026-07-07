async function getWeather(city) {

    try {

        searchBtn.innerHTML = "Searching...";
        searchBtn.disabled = true;

        

        const response = await fetch(
         `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=yes&alerts=no`);
        const data = await response.json();

        if (data.error) {
            alert(data.error.message);
            return;
        }

        updateCurrentWeather(data);

        updateHourlyForecast(data);

        updateWeeklyForecast(data);

        // Feature 8
        //updateTemperatureChart(data);

        //updateWeatherMap(data);

        //updateWeatherAlerts(data);

    }

    catch (error) {

        console.log(error);

    }

    finally {

        searchBtn.innerHTML = "Search";
        searchBtn.disabled = false;

    }

}

function updateCurrentWeather(data)
{
    cityName.textContent = capitalize(data.location.name);

    function capitalize(text) {

    return text.charAt(0).toUpperCase() + text.slice(1);

}

    countryName.textContent = data.location.country;

    // Save Search History
    saveSearch(
        data.location.name,
        data.location.country
    );

    loadSearchHistory();

    // Current Temperature
    temperature.textContent = data.current.temp_c + "°C";

    // Feels Like Temperature
    const feels = data.current.feelslike_c;

    feelsLike.textContent = feels + "°C";

    if (feels >= 35)
    {
        feelsLike.style.color = "red";
    }
    else if (feels <= 10)
    {
        feelsLike.style.color = "deepskyblue";
    }
    else
    {
        feelsLike.style.color = "";
    }

    // Weather Condition
    condition.textContent = data.current.condition.text;

    humidity.textContent = data.current.humidity + "%";

    wind.textContent = data.current.wind_kph + " km/h";

    pressure.textContent = data.current.pressure_mb + " hPa";

    // Sunrise & Sunset
    sunrise.textContent =
        data.forecast.forecastday[0].astro.sunrise;

    sunset.textContent =
        data.forecast.forecastday[0].astro.sunset;

    // ===============================
    // Moon Information
    // ===============================

    const phase =
        data.forecast.forecastday[0].astro.moon_phase;

    let moonIcon = "🌙";

    switch (phase)
    {
        case "New Moon":
            moonIcon = "🌑";
            break;

        case "Waxing Crescent":
            moonIcon = "🌒";
            break;

        case "First Quarter":
            moonIcon = "🌓";
            break;

        case "Waxing Gibbous":
            moonIcon = "🌔";
            break;

        case "Full Moon":
            moonIcon = "🌕";
            break;

        case "Waning Gibbous":
            moonIcon = "🌖";
            break;

        case "Last Quarter":
            moonIcon = "🌗";
            break;

        case "Waning Crescent":
            moonIcon = "🌘";
            break;

        default:
            moonIcon = "🌙";
    }

    moonPhase.textContent = `${moonIcon} ${phase}`;

    moonrise.textContent =
        data.forecast.forecastday[0].astro.moonrise;

    moonset.textContent =
        data.forecast.forecastday[0].astro.moonset;

    moonIllumination.textContent =
        data.forecast.forecastday[0].astro.moon_illumination + "%";

    // ===============================
    // UV Index
    // ===============================

    uv.textContent = data.current.uv;

    // ===============================
    // Air Quality Index
    // ===============================

    const airQuality =
        data.current.air_quality["us-epa-index"];

    let airQualityText = "";

    switch (airQuality)
    {
        case 1:
            airQualityText = "Good";
            break;

        case 2:
            airQualityText = "Moderate";
            break;

        case 3:
            airQualityText = "Unhealthy for Sensitive Groups";
            break;

        case 4:
            airQualityText = "Unhealthy";
            break;

        case 5:
            airQualityText = "Very Unhealthy";
            break;

        case 6:
            airQualityText = "Hazardous";
            break;

        default:
            airQualityText = "Unknown";
    }

    aqi.textContent = `${airQuality} (${airQualityText})`;

    // Weather Icon
    weatherIcon.src =
        "https:" + data.current.condition.icon;
}