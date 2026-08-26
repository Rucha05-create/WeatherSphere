// ============================================================
// WEATHERSPHERE - WEATHER.JS
// ============================================================
// Handles:
// 1. Fetching weather data through backend
// 2. Updating current weather
// 3. Updating location information
// 4. Updating air quality
// 5. Updating today's highlights
// 6. Updating hourly forecast
// 7. Updating weekly forecast
// 8. Updating temperature chart
// 9. Updating weather map
// 10. Updating weather alerts
// 11. Updating search history
// ============================================================


// ============================================================
// BACKEND API BASE URL
// ============================================================

const BACKEND_API_BASE_URL =
    "http://localhost:5000/api";


// ============================================================
// GET WEATHER
// ============================================================

async function getWeather(city) {

    // --------------------------------------------------------
    // Validate search
    // --------------------------------------------------------

    if (
        !city ||
        String(city).trim() === ""
    ) {

        alert(
            "Please enter a city, village, district, state or country."
        );

        return;

    }


    // --------------------------------------------------------
    // Clean search query
    // --------------------------------------------------------

    const searchQuery =
        String(city).trim();


    // --------------------------------------------------------
    // Show loading state
    // --------------------------------------------------------

    if (typeof searchBtn !== "undefined" && searchBtn) {

        searchBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Searching...';

        searchBtn.disabled = true;

    }


    try {

        // ====================================================
        // BACKEND WEATHER REQUEST
        // ====================================================
        //
        // IMPORTANT:
        // encodeURIComponent() converts:
        //
        // Los Angeles
        //       ↓
        // Los%20Angeles
        //
        // This prevents spaces and special characters from
        // breaking the URL.
        //
        // Backend receives:
        // /api/weather/Los%20Angeles
        //
        // Express automatically decodes the route parameter.
        // ====================================================

        const encodedCity =
            encodeURIComponent(searchQuery);


        const url =
            `${BACKEND_API_BASE_URL}/weather/${encodedCity}`;


        console.log(
            "WeatherSphere - Fetching from backend:",
            searchQuery
        );


        console.log(
            "WeatherSphere - Backend URL:",
            url
        );


        const response =
            await fetch(url);


        // ====================================================
        // READ RESPONSE
        // ====================================================

        let data = null;


        try {

            data =
                await response.json();

        }

        catch (jsonError) {

            console.error(
                "WeatherSphere - Invalid backend response:",
                jsonError
            );

            throw new Error(
                `Backend returned an invalid response (${response.status}).`
            );

        }


        // ====================================================
        // HTTP ERROR
        // ====================================================

        if (!response.ok) {

            const message =
                data?.error?.message ||
                data?.message ||
                `Weather request failed (${response.status}).`;


            console.error(
                "WeatherSphere - Backend Error:",
                message
            );


            throw new Error(message);

        }


        // ====================================================
        // API ERROR
        // ====================================================

        if (data?.error) {

            const message =
                data.error.message ||
                "Unable to retrieve weather information.";


            throw new Error(message);

        }


        // ====================================================
        // VALIDATE RESPONSE
        // ====================================================

        if (
            !data ||
            !data.location ||
            !data.current ||
            !data.forecast ||
            !Array.isArray(data.forecast.forecastday)
        ) {

            throw new Error(
                "Incomplete weather data received from the server."
            );

        }


        // ====================================================
        // LOG SUCCESSFUL RESPONSE
        // ====================================================

        console.log(
            "WeatherSphere - API Response:",
            data
        );


        // ====================================================
        // UPDATE CURRENT WEATHER
        // ====================================================

        updateCurrentWeather(data);


        // ====================================================
        // UPDATE HOURLY FORECAST
        // ====================================================

        if (
            typeof updateHourlyForecast === "function"
        ) {

            updateHourlyForecast(data);

        }


        // ====================================================
        // UPDATE WEEKLY FORECAST
        // ====================================================

        if (
            typeof updateWeeklyForecast === "function"
        ) {

            updateWeeklyForecast(data);

        }


        // ====================================================
        // UPDATE TEMPERATURE CHART
        // ====================================================

        if (
            typeof updateTemperatureChart === "function"
        ) {

            updateTemperatureChart(data);

        }


        // ====================================================
        // UPDATE WEATHER MAP
        // ====================================================

        if (
            typeof updateWeatherMap === "function"
        ) {

            updateWeatherMap(data);

        }


        // ====================================================
        // UPDATE WEATHER ALERTS
        // ====================================================

        if (
            typeof updateWeatherAlerts === "function"
        ) {

            updateWeatherAlerts(data);

        }


        // ====================================================
        // SAVE SEARCH HISTORY
        // ====================================================

        if (
            typeof saveSearch === "function"
        ) {

            try {

                await saveSearch(
                    data.location.name,
                    data.location.country
                );

            }

            catch (historyError) {

                console.error(
                    "WeatherSphere - Search history error:",
                    historyError
                );

            }

        }


        // ====================================================
        // RELOAD SEARCH HISTORY
        // ====================================================

        if (
            typeof loadSearchHistory === "function"
        ) {

            try {

                await loadSearchHistory();

            }

            catch (historyLoadError) {

                console.error(
                    "WeatherSphere - Unable to load search history:",
                    historyLoadError
                );

            }

        }


        // ====================================================
        // SUCCESS MESSAGE
        // ====================================================

        console.log(
            "WeatherSphere - Weather successfully loaded."
        );


        // ====================================================
        // SCROLL TO WEATHER CARD
        // ====================================================

        const weatherCard =
            document.querySelector(".weatherCard");


        if (weatherCard) {

            setTimeout(() => {

                weatherCard.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 250);

        }

    }


    // ========================================================
    // ERROR HANDLING
    // ========================================================

    catch (error) {

        console.error(
            "WeatherSphere Error:",
            error
        );


        // ----------------------------------------------------
        // Display useful error message
        // ----------------------------------------------------

        let message =
            error?.message ||
            "Unable to load weather information.";


        // ----------------------------------------------------
        // Network / backend unavailable
        // ----------------------------------------------------

        if (
            error instanceof TypeError ||
            message.toLowerCase().includes("failed to fetch")
        ) {

            message =
                "Unable to connect to the WeatherSphere backend.\n\n" +
                "Please make sure your Node.js server is running on:\n" +
                "http://localhost:5000";

        }


        alert(
            message
        );

    }


    // ========================================================
    // RESTORE SEARCH BUTTON
    // ========================================================

    finally {

        if (
            typeof searchBtn !== "undefined" &&
            searchBtn
        ) {

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

    console.log(
        "WeatherSphere - Updating current weather..."
    );


    // ========================================================
    // LOCATION DATA
    // ========================================================

    const location =
        data.location || {};


    const locationName =
        location.name || "--";


    const country =
        location.country || "--";


    const region =
        location.region || "";


    const district =
        location.district || "";


    // ========================================================
    // CITY NAME
    // ========================================================

    if (
        typeof cityName !== "undefined" &&
        cityName
    ) {

        cityName.textContent =
            locationName;

    }


    // ========================================================
    // COUNTRY + STATE + DISTRICT
    // ========================================================

    if (
        typeof countryName !== "undefined" &&
        countryName
    ) {

        const locationParts = [];


        if (district) {

            locationParts.push(
                district
            );

        }


        if (
            region &&
            region !== district &&
            region !== locationName
        ) {

            locationParts.push(
                region
            );

        }


        if (country) {

            locationParts.push(
                country
            );

        }


        countryName.textContent =
            locationParts.join(" • ");

    }


    // ========================================================
    // TEMPERATURE
    // ========================================================

    if (
        typeof temperature !== "undefined" &&
        temperature
    ) {

        const temp =
            data.current.temp_c;


        temperature.textContent =
            `${temp}°C`;

    }


    // ========================================================
    // WEATHER CONDITION
    // ========================================================

    if (
        typeof condition !== "undefined" &&
        condition
    ) {

        condition.textContent =
            data.current.condition?.text ||
            "--";

    }


    // ========================================================
    // WEATHER ICON
    // ========================================================

    if (
        typeof weatherIcon !== "undefined" &&
        weatherIcon
    ) {

        const icon =
            data.current.condition?.icon;


        if (icon) {

            weatherIcon.src =
                icon.startsWith("http")
                    ? icon
                    : "https:" + icon;

        }


        weatherIcon.alt =
            data.current.condition?.text ||
            "Weather Icon";

    }


    // ========================================================
    // HUMIDITY
    // ========================================================

    if (
        typeof humidity !== "undefined" &&
        humidity
    ) {

        humidity.textContent =
            `${data.current.humidity ?? "--"}%`;

    }


    // ========================================================
    // WIND
    // ========================================================

    if (
        typeof wind !== "undefined" &&
        wind
    ) {

        wind.textContent =
            `${data.current.wind_kph ?? "--"} km/h`;

    }


    // ========================================================
    // PRESSURE
    // ========================================================

    if (
        typeof pressure !== "undefined" &&
        pressure
    ) {

        pressure.textContent =
            `${data.current.pressure_mb ?? "--"} hPa`;

    }


    // ========================================================
    // FEELS LIKE
    // ========================================================

    if (
        typeof feelsLike !== "undefined" &&
        feelsLike
    ) {

        const feels =
            data.current.feelslike_c;


        if (
            feels !== undefined &&
            feels !== null
        ) {

            feelsLike.textContent =
                `${feels}°C`;

        }

        else {

            feelsLike.textContent =
                "--";

        }


        // ----------------------------------------------------
        // Temperature indicator
        // ----------------------------------------------------

        if (feels >= 35) {

            feelsLike.classList.add(
                "hot-value"
            );

            feelsLike.classList.remove(
                "cold-value"
            );

        }

        else if (feels <= 10) {

            feelsLike.classList.add(
                "cold-value"
            );

            feelsLike.classList.remove(
                "hot-value"
            );

        }

        else {

            feelsLike.classList.remove(
                "hot-value",
                "cold-value"
            );

        }

    }


    // ========================================================
    // UV INDEX
    // ========================================================

    if (
        typeof uv !== "undefined" &&
        uv
    ) {

        uv.textContent =
            data.current.uv ?? "--";

    }


    // ========================================================
    // ASTRONOMICAL INFORMATION
    // ========================================================

    updateAstronomy(data);


    // ========================================================
    // AIR QUALITY
    // ========================================================

    updateAirQuality(data);


    // ========================================================
    // HIGHLIGHTS
    // ========================================================

    updateHighlights(data);


    console.log(
        "WeatherSphere - Current weather updated."
    );

}



// ============================================================
// UPDATE ASTRONOMY
// ============================================================

function updateAstronomy(data) {

    const forecastDays =
        data.forecast?.forecastday;


    if (
        !forecastDays ||
        forecastDays.length === 0
    ) {

        return;

    }


    const today =
        forecastDays[0];


    const astro =
        today.astro;


    if (!astro) {

        return;

    }


    // ========================================================
    // SUNRISE
    // ========================================================

    if (
        typeof sunrise !== "undefined" &&
        sunrise
    ) {

        sunrise.textContent =
            astro.sunrise || "--";

    }


    // ========================================================
    // SUNSET
    // ========================================================

    if (
        typeof sunset !== "undefined" &&
        sunset
    ) {

        sunset.textContent =
            astro.sunset || "--";

    }


    // ========================================================
    // MOON PHASE
    // ========================================================

    if (
        typeof moonPhase !== "undefined" &&
        moonPhase
    ) {

        const phase =
            astro.moon_phase || "--";


        const icon =
            getMoonIcon(phase);


        moonPhase.textContent =
            `${icon} ${phase}`;

    }


    // ========================================================
    // MOONRISE
    // ========================================================

    if (
        typeof moonrise !== "undefined" &&
        moonrise
    ) {

        moonrise.textContent =
            astro.moonrise || "--";

    }


    // ========================================================
    // MOONSET
    // ========================================================

    if (
        typeof moonset !== "undefined" &&
        moonset
    ) {

        moonset.textContent =
            astro.moonset || "--";

    }


    // ========================================================
    // MOON ILLUMINATION
    // ========================================================

    if (
        typeof moonIllumination !== "undefined" &&
        moonIllumination
    ) {

        moonIllumination.textContent =
            `${astro.moon_illumination ?? "--"}%`;

    }

}



// ============================================================
// AIR QUALITY
// ============================================================

function updateAirQuality(data) {

    if (
        typeof aqi === "undefined" ||
        !aqi
    ) {

        return;

    }


    const airQuality =
        data.current?.air_quality;


    if (
        !airQuality ||
        airQuality["us-epa-index"] === undefined
    ) {

        aqi.textContent =
            "Unavailable";

        return;

    }


    const index =
        Number(
            airQuality["us-epa-index"]
        );


    const airQualityNames = {

        1: "Good",

        2: "Moderate",

        3: "Unhealthy for Sensitive Groups",

        4: "Unhealthy",

        5: "Very Unhealthy",

        6: "Hazardous"

    };


    const text =
        airQualityNames[index] ||
        "Unknown";


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


    if (
        !cards ||
        cards.length === 0
    ) {

        console.warn(
            "WeatherSphere - Highlight cards not found."
        );

        return;

    }


    const current =
        data.current || {};


    const today =
        data.forecast?.forecastday?.[0];


    // ========================================================
    // AIR QUALITY
    // ========================================================

    const airQuality =
        current.air_quality;


    let airQualityText =
        "Unavailable";


    if (
        airQuality &&
        airQuality["us-epa-index"] !== undefined
    ) {

        const index =
            Number(
                airQuality["us-epa-index"]
            );


        const names = {

            1: "Good",

            2: "Moderate",

            3: "Unhealthy for Sensitive Groups",

            4: "Unhealthy",

            5: "Very Unhealthy",

            6: "Hazardous"

        };


        airQualityText =
            names[index] ||
            "Unknown";

    }


    // ========================================================
    // CHANCE OF RAIN
    // ========================================================

    const rainChance =
        today?.day?.daily_chance_of_rain;


    // ========================================================
    // VISIBILITY
    // ========================================================

    const visibility =
        current.vis_km;


    // ========================================================
    // FEELS LIKE
    // ========================================================

    const feels =
        current.feelslike_c;


    // ========================================================
    // UPDATE AIR QUALITY CARD
    // ========================================================

    if (cards[0]) {

        const value =
            cards[0].querySelector("p");


        if (value) {

            value.textContent =
                airQualityText;

        }

    }


    // ========================================================
    // UPDATE RAIN CARD
    // ========================================================

    if (cards[1]) {

        const value =
            cards[1].querySelector("p");


        if (value) {

            value.textContent =
                rainChance !== undefined
                    ? `${rainChance}%`
                    : "--";

        }

    }


    // ========================================================
    // UPDATE VISIBILITY CARD
    // ========================================================

    if (cards[2]) {

        const value =
            cards[2].querySelector("p");


        if (value) {

            value.textContent =
                visibility !== undefined
                    ? `${visibility} km`
                    : "--";

        }

    }


    // ========================================================
    // UPDATE FEELS LIKE CARD
    // ========================================================

    if (cards[3]) {

        const value =
            cards[3].querySelector("p");


        if (value) {

            value.textContent =
                feels !== undefined
                    ? `${feels}°C`
                    : "--";

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
// LOCATION DISPLAY HELPER
// ============================================================

function getLocationDisplay(location) {

    if (!location) {

        return "--";

    }


    const parts = [];


    if (location.district) {

        parts.push(
            location.district
        );

    }


    if (
        location.region &&
        location.region !== location.district
    ) {

        parts.push(
            location.region
        );

    }


    if (location.country) {

        parts.push(
            location.country
        );

    }


    return parts.join(" • ");

}



// ============================================================
// CAPITALIZE TEXT
// ============================================================

function capitalize(text) {

    if (!text) {

        return "--";

    }


    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );

}



// ============================================================
// TEST WEATHER
// ============================================================
// Run this in browser console:
//
// testWeather();
//
// ============================================================

function testWeather() {

    console.log(
        "================================"
    );

    console.log(
        "WeatherSphere Test"
    );

    console.log(
        "================================"
    );


    console.log(
        "Testing backend connection..."
    );


    getWeather("Pune");

}



// ============================================================
// TEST LOCATION WITH SPACES
// ============================================================
// Run this in browser console:
//
// testLocationWithSpaces();
//
// This specifically tests:
//
// Los Angeles
// New York
// New Delhi
// Chatrapati Sambhajinagar
//
// ============================================================

function testLocationWithSpaces() {

    console.log(
        "================================"
    );

    console.log(
        "WeatherSphere - Space Encoding Test"
    );

    console.log(
        "================================"
    );


    const city =
        "Los Angeles";


    const encodedCity =
        encodeURIComponent(city);


    console.log(
        "Original:",
        city
    );


    console.log(
        "Encoded:",
        encodedCity
    );


    console.log(
        "Request URL:",
        `${BACKEND_API_BASE_URL}/weather/${encodedCity}`
    );


    getWeather(city);

}



// ============================================================
// END OF WEATHER.JS
// ============================================================