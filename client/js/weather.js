// ============================================================
// WEATHER.JS
// ============================================================
// Handles:
// 1. Fetching weather data
// 2. Updating current weather
// 3. Updating highlights
// 4. Updating weather map
// 5. Updating temperature chart
// 6. Updating alerts
// ============================================================


// ============================================================
// GET WEATHER
// ============================================================

async function getWeather(city) {

    // Make sure city exists
    if (!city || city.trim() === "") {
        alert("Please enter a city name.");
        return;
    }

    try {

        // ----------------------------------------------------
        // Show loading state
        // ----------------------------------------------------

        if (searchBtn) {
            searchBtn.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Searching...';

            searchBtn.disabled = true;
        }


        // ----------------------------------------------------
        // WeatherAPI Request
        // ----------------------------------------------------

        const url =
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=7&aqi=yes&alerts=yes`;

        console.log("Fetching weather:", url);


        const response = await fetch(url);


        // ----------------------------------------------------
        // Check HTTP response
        // ----------------------------------------------------

        if (!response.ok) {

            throw new Error(
                `Weather API error: ${response.status}`
            );

        }


        const data = await response.json();


        console.log("Weather API Response:", data);


        // ----------------------------------------------------
        // Check API error
        // ----------------------------------------------------

        if (data.error) {

            alert(
                "Unable to find weather data: " +
                data.error.message
            );

            return;
        }


        // ----------------------------------------------------
        // Make sure forecast data exists
        // ----------------------------------------------------

        if (
            !data.location ||
            !data.current ||
            !data.forecast ||
            !data.forecast.forecastday
        ) {

            throw new Error(
                "Invalid weather data received from API."
            );

        }


        // ====================================================
        // UPDATE ALL WEBSITE SECTIONS
        // ====================================================


        // Current weather
        updateCurrentWeather(data);


        // Hourly forecast
        if (
            typeof updateHourlyForecast === "function"
        ) {

            updateHourlyForecast(data);

        }


        // 7 day forecast
        if (
            typeof updateWeeklyForecast === "function"
        ) {

            updateWeeklyForecast(data);

        }


        // Temperature chart
        if (
            typeof updateTemperatureChart === "function"
        ) {

            updateTemperatureChart(data);

        }


        // Weather map
        if (
            typeof updateWeatherMap === "function"
        ) {

            updateWeatherMap(data);

        }


        // Weather alerts
        if (
            typeof updateWeatherAlerts === "function"
        ) {

            updateWeatherAlerts(data);

        }


        // ----------------------------------------------------
        // Scroll to weather section
        // ----------------------------------------------------

        const weatherCard =
            document.querySelector(".weatherCard");

        if (weatherCard) {

            setTimeout(() => {

                weatherCard.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 200);

        }


    }

    catch (error) {

        console.error(
            "Weather loading error:",
            error
        );

        alert(
            "Something went wrong while loading weather data.\n\n" +
            error.message
        );

    }

    finally {

        // ----------------------------------------------------
        // Restore search button
        // ----------------------------------------------------

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

    console.log("Updating current weather...");


    // ========================================================
    // LOCATION
    // ========================================================

    const locationName =
        data.location.name || "--";


    const country =
        data.location.country || "--";


    if (cityName) {

        cityName.textContent =
            capitalize(locationName);

    }


    if (countryName) {

        countryName.textContent =
            country;

    }


    // ========================================================
    // CURRENT TEMPERATURE
    // ========================================================

    if (temperature) {

        temperature.textContent =
            `${data.current.temp_c}°C`;

    }


    // ========================================================
    // WEATHER CONDITION
    // ========================================================

    if (condition) {

        condition.textContent =
            data.current.condition.text;

    }


    // ========================================================
    // WEATHER ICON
    // ========================================================

    if (weatherIcon) {

        weatherIcon.src =
            "https:" +
            data.current.condition.icon;

        weatherIcon.alt =
            data.current.condition.text;

    }


    // ========================================================
    // HUMIDITY
    // ========================================================

    if (humidity) {

        humidity.textContent =
            `${data.current.humidity}%`;

    }


    // ========================================================
    // WIND
    // ========================================================

    if (wind) {

        wind.textContent =
            `${data.current.wind_kph} km/h`;

    }


    // ========================================================
    // PRESSURE
    // ========================================================

    if (pressure) {

        pressure.textContent =
            `${data.current.pressure_mb} hPa`;

    }


    // ========================================================
    // FEELS LIKE
    // ========================================================

    if (feelsLike) {

        const feels =
            data.current.feelslike_c;

        feelsLike.textContent =
            `${feels}°C`;


        // Temperature-based color

        if (feels >= 35) {

            feelsLike.style.color =
                "red";

        }

        else if (feels <= 10) {

            feelsLike.style.color =
                "deepskyblue";

        }

        else {

            feelsLike.style.color =
                "";

        }

    }


    // ========================================================
    // TODAY'S ASTRO DATA
    // ========================================================

    const today =
        data.forecast.forecastday[0];


    if (today && today.astro) {


        // ----------------------------------------------------
        // Sunrise
        // ----------------------------------------------------

        if (sunrise) {

            sunrise.textContent =
                today.astro.sunrise || "--";

        }


        // ----------------------------------------------------
        // Sunset
        // ----------------------------------------------------

        if (sunset) {

            sunset.textContent =
                today.astro.sunset || "--";

        }


        // ----------------------------------------------------
        // Moon Phase
        // ----------------------------------------------------

        if (moonPhase) {

            const phase =
                today.astro.moon_phase || "--";


            const moonIcon =
                getMoonIcon(phase);


            moonPhase.textContent =
                `${moonIcon} ${phase}`;

        }


        // ----------------------------------------------------
        // Moonrise
        // ----------------------------------------------------

        if (moonrise) {

            moonrise.textContent =
                today.astro.moonrise || "--";

        }


        // ----------------------------------------------------
        // Moonset
        // ----------------------------------------------------

        if (moonset) {

            moonset.textContent =
                today.astro.moonset || "--";

        }


        // ----------------------------------------------------
        // Moon Illumination
        // ----------------------------------------------------

        if (moonIllumination) {

            moonIllumination.textContent =
                `${today.astro.moon_illumination || 0}%`;

        }

    }


    // ========================================================
    // UV INDEX
    // ========================================================

    if (uv) {

        uv.textContent =
            data.current.uv ?? "--";

    }


    // ========================================================
    // AIR QUALITY
    // ========================================================

    updateAirQuality(data);


    // ========================================================
    // HIGHLIGHTS
    // ========================================================

    updateHighlights(data);


    // ========================================================
    // SEARCH HISTORY
    // ========================================================

    if (
        typeof saveSearch === "function"
    ) {

        saveSearch(
            locationName,
            country
        );

    }


    if (
        typeof loadSearchHistory === "function"
    ) {

        loadSearchHistory();

    }


    console.log(
        "Current weather updated successfully."
    );

}



// ============================================================
// AIR QUALITY
// ============================================================

function updateAirQuality(data) {

    if (!aqi) {
        return;
    }


    // WeatherAPI air quality data

    const airQuality =
        data.current.air_quality;


    if (
        !airQuality ||
        airQuality["us-epa-index"] === undefined
    ) {

        aqi.textContent =
            "Unavailable";

        return;

    }


    const index =
        airQuality["us-epa-index"];


    let text;


    switch (index) {

        case 1:
            text = "Good";
            break;

        case 2:
            text = "Moderate";
            break;

        case 3:
            text = "Unhealthy for Sensitive Groups";
            break;

        case 4:
            text = "Unhealthy";
            break;

        case 5:
            text = "Very Unhealthy";
            break;

        case 6:
            text = "Hazardous";
            break;

        default:
            text = "Unknown";

    }


    aqi.textContent =
        `${index} - ${text}`;

}



// ============================================================
// TODAY'S HIGHLIGHTS
// ============================================================

function updateHighlights(data) {

    const cards =
        document.querySelectorAll(
            ".highlights .card"
        );


    if (!cards || cards.length === 0) {

        console.warn(
            "Highlight cards not found."
        );

        return;

    }


    const today =
        data.forecast.forecastday[0];


    // --------------------------------------------------------
    // Air Quality
    // --------------------------------------------------------

    const airQuality =
        data.current.air_quality;


    let airQualityText =
        "Unavailable";


    if (
        airQuality &&
        airQuality["us-epa-index"]
    ) {

        const index =
            airQuality["us-epa-index"];


        const names = {

            1: "Good",
            2: "Moderate",
            3: "Unhealthy for Sensitive Groups",
            4: "Unhealthy",
            5: "Very Unhealthy",
            6: "Hazardous"

        };


        airQualityText =
            names[index] || "Unknown";

    }


    // --------------------------------------------------------
    // Chance of Rain
    // --------------------------------------------------------

    const rainChance =
        today &&
        today.day
            ? today.day.daily_chance_of_rain
            : 0;


    // --------------------------------------------------------
    // Visibility
    // --------------------------------------------------------

    const visibility =
        data.current.vis_km;


    // --------------------------------------------------------
    // Feels Like
    // --------------------------------------------------------

    const feels =
        data.current.feelslike_c;


    // --------------------------------------------------------
    // Update Cards
    // --------------------------------------------------------

    if (cards[0]) {

        const value =
            cards[0].querySelector("p");

        if (value) {

            value.textContent =
                airQualityText;

        }

    }


    if (cards[1]) {

        const value =
            cards[1].querySelector("p");

        if (value) {

            value.textContent =
                `${rainChance ?? 0}%`;

        }

    }


    if (cards[2]) {

        const value =
            cards[2].querySelector("p");

        if (value) {

            value.textContent =
                `${visibility ?? "--"} km`;

        }

    }


    if (cards[3]) {

        const value =
            cards[3].querySelector("p");

        if (value) {

            value.textContent =
                `${feels ?? "--"}°C`;

        }

    }

}



// ============================================================
// MOON ICON
// ============================================================

function getMoonIcon(phase) {

    switch (phase) {

        case "New Moon":
            return "🌑";

        case "Waxing Crescent":
            return "🌒";

        case "First Quarter":
            return "🌓";

        case "Waxing Gibbous":
            return "🌔";

        case "Full Moon":
            return "🌕";

        case "Waning Gibbous":
            return "🌖";

        case "Last Quarter":
            return "🌗";

        case "Waning Crescent":
            return "🌘";

        default:
            return "🌙";

    }

}



// ============================================================
// CAPITALIZE CITY NAME
// ============================================================

function capitalize(text) {

    if (!text) {
        return "--";
    }


    return text.charAt(0).toUpperCase() +
           text.slice(1);

}



// ============================================================
// TEST FUNCTION
// ============================================================
// You can run this from browser console:
// testWeather();
//
// This is useful if the website is not loading data.
// ============================================================

function testWeather() {

    console.log(
        "Testing WeatherSphere..."
    );


    if (!API_KEY) {

        console.error(
            "API_KEY is missing!"
        );

        return;

    }


    console.log(
        "API key exists."
    );


    getWeather("Pune");

}