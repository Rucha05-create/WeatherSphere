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
//
// IMPORTANT:
// Weather requests are sent through the Node.js backend.
// This keeps the WeatherAPI key hidden from the frontend.
// ============================================================


// ============================================================
// BACKEND URL
// ============================================================

const BACKEND_URL =
    "http://localhost:5000";


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
    // Clean location query
    // --------------------------------------------------------

    const searchQuery =
        String(city).trim();


    // --------------------------------------------------------
    // Show loading state
    // --------------------------------------------------------

    if (searchBtn) {

        searchBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Searching...';

        searchBtn.disabled = true;

    }


    try {

        // ====================================================
        // BACKEND WEATHER REQUEST
        // ====================================================
        //
        // encodeURIComponent() is VERY important here.
        //
        // Examples:
        //
        // Pune
        // New Delhi       -> New%20Delhi
        // Los Angeles     -> Los%20Angeles
        // Jalgaon         -> Jalgaon
        // 18.5204,73.8567
        //
        // This prevents spaces and special characters from
        // breaking the URL.
        // ====================================================

        const encodedQuery =
            encodeURIComponent(searchQuery);


        const url =
            `${BACKEND_URL}/api/weather/${encodedQuery}`;


        console.log(
            "WeatherSphere - Backend Request:",
            searchQuery
        );

        console.log(
            "WeatherSphere - Request URL:",
            url
        );


        // ====================================================
        // FETCH FROM BACKEND
        // ====================================================

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
                "The backend returned an invalid response."
            );

        }


        // ====================================================
        // BACKEND ERROR
        // ====================================================

        if (!response.ok) {

            const message =
                data?.error?.message ||
                data?.message ||
                "Unable to retrieve weather information.";


            throw new Error(message);

        }


        // ====================================================
        // API ERROR
        // ====================================================

        if (data?.error) {

            alert(
                "Location not found.\n\n" +
                (
                    data.error.message ||
                    "Unable to find this location."
                ) +
                "\n\nPlease select a location from the suggestions."
            );

            return;

        }


        // ====================================================
        // VALIDATE WEATHER DATA
        // ====================================================

        if (
            !data ||
            !data.location ||
            !data.current ||
            !data.forecast ||
            !Array.isArray(
                data.forecast.forecastday
            )
        ) {

            throw new Error(
                "Incomplete weather data received from the backend."
            );

        }


        // ====================================================
        // UPDATE CURRENT WEATHER
        // ====================================================

        updateCurrentWeather(data);


        // ====================================================
        // UPDATE HOURLY FORECAST
        // ====================================================

        if (
            typeof updateHourlyForecast ===
            "function"
        ) {

            updateHourlyForecast(data);

        }


        // ====================================================
        // UPDATE WEEKLY FORECAST
        // ====================================================

        if (
            typeof updateWeeklyForecast ===
            "function"
        ) {

            updateWeeklyForecast(data);

        }


        // ====================================================
        // UPDATE TEMPERATURE CHART
        // ====================================================

        if (
            typeof updateTemperatureChart ===
            "function"
        ) {

            updateTemperatureChart(data);

        }


        // ====================================================
        // UPDATE WEATHER MAP
        // ====================================================

        if (
            typeof updateWeatherMap ===
            "function"
        ) {

            updateWeatherMap(data);

        }


        // ====================================================
        // UPDATE WEATHER ALERTS
        // ====================================================

        if (
            typeof updateWeatherAlerts ===
            "function"
        ) {

            updateWeatherAlerts(data);

        }


        // ====================================================
        // SAVE SEARCH HISTORY
        // ====================================================

        if (
            typeof saveSearch ===
            "function"
        ) {

            saveSearch(
                data.location.name,
                data.location.country
            );

        }


        if (
            typeof loadSearchHistory ===
            "function"
        ) {

            loadSearchHistory();

        }


        // ====================================================
        // UPDATE INPUT WITH ACTUAL LOCATION
        // ====================================================

        const actualLocation =
            getLocationDisplay(
                data.location
            );


        const cityInput =
            document.getElementById(
                "cityInput"
            );


        if (cityInput) {

            cityInput.value =
                data.location.name || searchQuery;

        }


        // ====================================================
        // SUCCESS LOG
        // ====================================================

        console.log(
            "WeatherSphere - Weather successfully loaded."
        );


        console.log(
            "WeatherSphere - Location:",
            data.location.name,
            data.location.region,
            data.location.country
        );


        console.log(
            "WeatherSphere - Coordinates:",
            data.location.lat,
            data.location.lon
        );


        // ====================================================
        // SCROLL TO WEATHER CARD
        // ====================================================

        const weatherCard =
            document.querySelector(
                ".weatherCard"
            );


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
        // Backend unavailable
        // ----------------------------------------------------

        if (
            error instanceof TypeError &&
            error.message.includes(
                "Failed to fetch"
            )
        ) {

            alert(
                "Unable to connect to the WeatherSphere backend.\n\n" +
                "Please make sure your Node.js server is running on:\n" +
                "http://localhost:5000"
            );

        }

        else {

            alert(
                "Unable to load weather information.\n\n" +
                error.message
            );

        }

    }


    // ========================================================
    // RESTORE SEARCH BUTTON
    // ========================================================

    finally {

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

    console.log(
        "WeatherSphere - Updating current weather..."
    );


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

    if (cityName) {

        cityName.textContent =
            locationName;

    }


    // ========================================================
    // COUNTRY + STATE + DISTRICT
    // ========================================================

    if (countryName) {

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

    if (temperature) {

        const temp =
            data.current.temp_c;


        temperature.textContent =
            `${temp}°C`;

    }


    // ========================================================
    // WEATHER CONDITION
    // ========================================================

    if (condition) {

        condition.textContent =
            data.current.condition?.text ||
            "--";

    }


    // ========================================================
    // WEATHER ICON
    // ========================================================

    if (weatherIcon) {

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

    if (humidity) {

        humidity.textContent =
            `${data.current.humidity ?? "--"}%`;

    }


    // ========================================================
    // WIND
    // ========================================================

    if (wind) {

        wind.textContent =
            `${data.current.wind_kph ?? "--"} km/h`;

    }


    // ========================================================
    // PRESSURE
    // ========================================================

    if (pressure) {

        pressure.textContent =
            `${data.current.pressure_mb ?? "--"} hPa`;

    }


    // ========================================================
    // FEELS LIKE
    // ========================================================

    if (feelsLike) {

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

    if (uv) {

        uv.textContent =
            data.current.uv ?? "--";

    }


    // ========================================================
    // ASTRONOMY
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


    if (sunrise) {

        sunrise.textContent =
            astro.sunrise || "--";

    }


    if (sunset) {

        sunset.textContent =
            astro.sunset || "--";

    }


    if (moonPhase) {

        const phase =
            astro.moon_phase || "--";


        const icon =
            getMoonIcon(phase);


        moonPhase.textContent =
            `${icon} ${phase}`;

    }


    if (moonrise) {

        moonrise.textContent =
            astro.moonrise || "--";

    }


    if (moonset) {

        moonset.textContent =
            astro.moonset || "--";

    }


    if (moonIllumination) {

        moonIllumination.textContent =
            `${astro.moon_illumination ?? "--"}%`;

    }

}



// ============================================================
// AIR QUALITY
// ============================================================

function updateAirQuality(data) {

    if (!aqi) {

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
            `${index} - ${names[index] || "Unknown"}`;

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
// Run in browser console:
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


    getWeather("Pune");

}