// ============================================================
// WEATHERSPHERE - WEATHER.JS
// ============================================================
// Loads weather through fetchWeatherData() (api.js) and
// updates the current weather, astronomy, air quality and
// highlights. Other sections are updated by their own files.
// ============================================================


// ============================================================
// GET WEATHER
// ============================================================

async function getWeather(city) {

    if (!city || String(city).trim() === "") {
        alert("Please enter a city, village, district, state or country.");
        return;
    }

    const searchQuery = String(city).trim();

    // Loading state
    if (searchBtn) {
        searchBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Searching...';
        searchBtn.disabled = true;
    }

    try {

        // Fetch (api.js validates the response and handles errors)
        const data = await fetchWeatherData(searchQuery);

        // Current weather, astronomy, air quality, highlights
        updateCurrentWeather(data);

        // Other sections (each lives in its own file)
        if (typeof updateHourlyForecast === "function") {
            updateHourlyForecast(data);
        } else {
            console.warn("updateHourlyForecast() not found");
        }

        if (typeof updateWeeklyForecast === "function") {
            updateWeeklyForecast(data);
        } else {
            console.warn("updateWeeklyForecast() not found");
        }

        if (typeof updateTemperatureChart === "function") {
            updateTemperatureChart(data);
        } else {
            console.warn("updateTemperatureChart() not found");
        }

        if (typeof updateWeatherMap === "function") {
            updateWeatherMap(data);
        } else {
            console.warn("updateWeatherMap() not found");
        }

        if (typeof updateWeatherAlerts === "function") {
            updateWeatherAlerts(data);
        } else {
            console.warn("updateWeatherAlerts() not found");
        }

        // Search history
        if (typeof saveSearch === "function") {
            saveSearch(data.location.name, data.location.country);
        } else {
            console.warn("saveSearch() not found");
        }

        if (typeof loadSearchHistory === "function") {
            loadSearchHistory();
        } else {
            console.warn("loadSearchHistory() not found");
        }

        // Show the actual location name in the search box
        if (cityInput) {
            cityInput.value = data.location.name || searchQuery;
        }

        console.log(
            "WeatherSphere - Weather loaded:",
            data.location.name,
            data.location.region,
            data.location.country
        );

        // Scroll to the weather card
        const weatherCard = document.querySelector(".weatherCard");

        if (weatherCard) {
            setTimeout(() => {
                weatherCard.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }, 250);
        }

    } catch (error) {

        console.error("WeatherSphere Error:", error);

        alert("Unable to load weather information.\n\n" + error.message);

    } finally {

        // Restore search button
        if (searchBtn) {
            searchBtn.innerHTML =
                '<i class="fa-solid fa-magnifying-glass"></i> Search';
            searchBtn.disabled = false;
        }

    }

}


// ============================================================
// UPDATE CURRENT WEATHER
// ============================================================

function updateCurrentWeather(data) {

    const location = data.location || {};
    const current = data.current || {};

    const locationName = location.name || "--";
    const country = location.country || "--";
    const region = location.region || "";
    const district = location.district || "";

    // City name
    if (cityName) {
        cityName.textContent = locationName;
    }

    // Region + country
    if (countryName) {

        const parts = [];

        if (district) {
            parts.push(district);
        }

        if (region && region !== district && region !== locationName) {
            parts.push(region);
        }

        if (country) {
            parts.push(country);
        }

        countryName.textContent = parts.join(" • ");
    }

    // Temperature
    if (temperature) {
        temperature.textContent = `${current.temp_c ?? "--"}°C`;
    }

    // Condition text
    if (condition) {
        condition.textContent = current.condition?.text || "--";
    }

    // Weather icon
    if (weatherIcon) {

        const icon = current.condition?.icon;

        if (icon) {
            weatherIcon.src = icon.startsWith("http") ? icon : "https:" + icon;
        }

        weatherIcon.alt = current.condition?.text || "Weather Icon";
    }

    // Humidity, wind, pressure
    if (humidity) {
        humidity.textContent = `${current.humidity ?? "--"}%`;
    }

    if (wind) {
        wind.textContent = `${current.wind_kph ?? "--"} km/h`;
    }

    if (pressure) {
        pressure.textContent = `${current.pressure_mb ?? "--"} hPa`;
    }

    // Feels like
    if (feelsLike) {

        const feels = current.feelslike_c;

        feelsLike.textContent =
            feels !== undefined && feels !== null ? `${feels}°C` : "--";

        feelsLike.classList.remove("hot-value", "cold-value");

        if (feels >= 35) {
            feelsLike.classList.add("hot-value");
        } else if (feels <= 10) {
            feelsLike.classList.add("cold-value");
        }
    }

    // UV index
    if (uv) {
        uv.textContent = current.uv ?? "--";
    }

    updateAstronomy(data);
    updateAirQuality(data);
    updateHighlights(data);

}


// ============================================================
// UPDATE ASTRONOMY
// ============================================================

function updateAstronomy(data) {

    const forecastDays = data.forecast?.forecastday;

    if (!forecastDays || forecastDays.length === 0) {
        return;
    }

    const astro = forecastDays[0].astro;

    if (!astro) {
        return;
    }

    if (sunrise) {
        sunrise.textContent = astro.sunrise || "--";
    }

    if (sunset) {
        sunset.textContent = astro.sunset || "--";
    }

    if (moonPhase) {
        const phase = astro.moon_phase || "--";
        moonPhase.textContent = `${getMoonIcon(phase)} ${phase}`;
    }

    if (moonrise) {
        moonrise.textContent = astro.moonrise || "--";
    }

    if (moonset) {
        moonset.textContent = astro.moonset || "--";
    }

    if (moonIllumination) {
        moonIllumination.textContent = `${astro.moon_illumination ?? "--"}%`;
    }

}


// ============================================================
// AIR QUALITY
// ============================================================

const AIR_QUALITY_NAMES = {
    1: "Good",
    2: "Moderate",
    3: "Unhealthy for Sensitive Groups",
    4: "Unhealthy",
    5: "Very Unhealthy",
    6: "Hazardous"
};

function getAirQualityText(data) {

    const airQuality = data.current?.air_quality;

    if (!airQuality || airQuality["us-epa-index"] === undefined) {
        return "Unavailable";
    }

    const index = Number(airQuality["us-epa-index"]);

    return `${index} - ${AIR_QUALITY_NAMES[index] || "Unknown"}`;

}

function updateAirQuality(data) {

    if (!aqi) {
        return;
    }

    aqi.textContent = getAirQualityText(data);

}


// ============================================================
// TODAY'S HIGHLIGHTS
// ============================================================

function updateHighlights(data) {

    const current = data.current || {};
    const today = data.forecast?.forecastday?.[0];

    const rainChance = today?.day?.daily_chance_of_rain;
    const visibility = current.vis_km;
    const feels = current.feelslike_c;

    const highlightAqi = document.getElementById("highlightAqi");
    const highlightRain = document.getElementById("highlightRain");
    const highlightVisibility = document.getElementById("highlightVisibility");
    const highlightFeels = document.getElementById("highlightFeels");

    if (highlightAqi) {
        highlightAqi.textContent = getAirQualityText(data);
    }

    if (highlightRain) {
        highlightRain.textContent =
            rainChance !== undefined ? `${rainChance}%` : "--";
    }

    if (highlightVisibility) {
        highlightVisibility.textContent =
            visibility !== undefined ? `${visibility} km` : "--";
    }

    if (highlightFeels) {
        highlightFeels.textContent =
            feels !== undefined ? `${feels}°C` : "--";
    }

}


// ============================================================
// MOON ICON
// ============================================================

function getMoonIcon(phase) {

    switch (phase) {
        case "New Moon":        return "🌑";
        case "Waxing Crescent": return "🌒";
        case "First Quarter":   return "🌓";
        case "Waxing Gibbous":  return "🌔";
        case "Full Moon":       return "🌕";
        case "Waning Gibbous":  return "🌖";
        case "Last Quarter":    return "🌗";
        case "Waning Crescent": return "🌘";
        default:                return "🌙";
    }

}


// ============================================================
// TEST WEATHER
// ============================================================
// Run in the browser console:  testWeather();
// ============================================================

function testWeather() {
    getWeather("Pune");
}