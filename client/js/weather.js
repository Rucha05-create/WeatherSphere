// ============================================================
// WEATHERSPHERE - WEATHER.JS
// ============================================================


// ============================================================
// GET WEATHER
// ============================================================

async function getWeather(city) {

    try {

        // ------------------------------------------------------
        // SEARCH BUTTON LOADING
        // ------------------------------------------------------

        searchBtn.innerHTML = "Searching...";
        searchBtn.disabled = true;


        // ------------------------------------------------------
        // WEATHER API
        // ------------------------------------------------------

        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=yes&alerts=no`
        );


        const data = await response.json();


        // ------------------------------------------------------
        // API ERROR
        // ------------------------------------------------------

        if (data.error) {

            alert(data.error.message);

            return;

        }


        console.log(
            "Weather API Response:",
            data
        );


        // ------------------------------------------------------
        // CURRENT WEATHER
        // ------------------------------------------------------

        updateCurrentWeather(data);


        // ------------------------------------------------------
        // 24 HOUR FORECAST
        // ------------------------------------------------------

        if (
            typeof updateHourlyForecast === "function"
        ) {

            updateHourlyForecast(data);

        }


        // ------------------------------------------------------
        // 7 DAY FORECAST
        // ------------------------------------------------------

        if (
            typeof updateWeeklyForecast === "function"
        ) {

            updateWeeklyForecast(data);

        }


        // ------------------------------------------------------
        // 24 HOUR TEMPERATURE CHART
        // ------------------------------------------------------

        if (
            typeof updateTemperatureChart === "function"
        ) {

            updateTemperatureChart(data);

        }


        // ------------------------------------------------------
        // WEATHER MAP
        // ------------------------------------------------------

        if (
            typeof updateWeatherMap === "function"
        ) {

            updateWeatherMap(data);

        }


        // ------------------------------------------------------
        // WEATHER ALERTS
        // ------------------------------------------------------

        if (
            typeof updateWeatherAlerts === "function"
        ) {

            updateWeatherAlerts(data);

        }

    }

    catch (error) {

        console.error(
            "Weather Error:",
            error
        );

        alert(
            "Unable to fetch weather data. Please try again."
        );

    }

    finally {

        // ------------------------------------------------------
        // RESET SEARCH BUTTON
        // ------------------------------------------------------

        searchBtn.innerHTML = `
            <i class="fa-solid fa-magnifying-glass"></i>
            Search
        `;

        searchBtn.disabled = false;

    }

}



// ============================================================
// UPDATE CURRENT WEATHER
// ============================================================

function updateCurrentWeather(data) {

    // ========================================================
    // LOCATION
    // ========================================================

    cityName.textContent =
        capitalize(data.location.name);


    countryName.textContent =
        data.location.country;


    // ========================================================
    // SAVE SEARCH HISTORY
    // ========================================================

    if (
        typeof saveSearch === "function"
    ) {

        saveSearch(
            data.location.name,
            data.location.country
        );

    }


    if (
        typeof loadSearchHistory === "function"
    ) {

        loadSearchHistory();

    }


    // ========================================================
    // CURRENT TEMPERATURE
    // ========================================================

    temperature.textContent =
        data.current.temp_c + "°C";


    // ========================================================
    // FEELS LIKE
    // ========================================================

    const feels =
        data.current.feelslike_c;


    feelsLike.textContent =
        feels + "°C";


    if (feels >= 35) {

        feelsLike.style.color = "red";

    }

    else if (feels <= 10) {

        feelsLike.style.color = "deepskyblue";

    }

    else {

        feelsLike.style.color = "";

    }


    // ========================================================
    // WEATHER CONDITION
    // ========================================================

    condition.textContent =
        data.current.condition.text;


    // ========================================================
    // HUMIDITY
    // ========================================================

    humidity.textContent =
        data.current.humidity + "%";


    // ========================================================
    // WIND
    // ========================================================

    wind.textContent =
        data.current.wind_kph + " km/h";


    // ========================================================
    // PRESSURE
    // ========================================================

    pressure.textContent =
        data.current.pressure_mb + " hPa";


    // ========================================================
    // SUNRISE
    // ========================================================

    sunrise.textContent =
        data.forecast.forecastday[0]
            .astro.sunrise;


    // ========================================================
    // SUNSET
    // ========================================================

    sunset.textContent =
        data.forecast.forecastday[0]
            .astro.sunset;



    // ========================================================
    // MOON INFORMATION
    // ========================================================

    const phase =
        data.forecast.forecastday[0]
            .astro.moon_phase;


    let moonIcon = "🌙";


    switch (phase) {

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


    moonPhase.textContent =
        `${moonIcon} ${phase}`;


    // ========================================================
    // MOONRISE
    // ========================================================

    moonrise.textContent =
        data.forecast.forecastday[0]
            .astro.moonrise;


    // ========================================================
    // MOONSET
    // ========================================================

    moonset.textContent =
        data.forecast.forecastday[0]
            .astro.moonset;


    // ========================================================
    // MOON ILLUMINATION
    // ========================================================

    moonIllumination.textContent =
        data.forecast.forecastday[0]
            .astro.moon_illumination + "%";



    // ========================================================
    // UV INDEX
    // ========================================================

    uv.textContent =
        data.current.uv;



    // ========================================================
    // AIR QUALITY
    // ========================================================

    if (
        data.current.air_quality
    ) {

        const airQuality =
            data.current.air_quality[
                "us-epa-index"
            ];


        let airQualityText = "";


        switch (airQuality) {

            case 1:

                airQualityText = "Good";

                break;


            case 2:

                airQualityText = "Moderate";

                break;


            case 3:

                airQualityText =
                    "Unhealthy for Sensitive Groups";

                break;


            case 4:

                airQualityText =
                    "Unhealthy";

                break;


            case 5:

                airQualityText =
                    "Very Unhealthy";

                break;


            case 6:

                airQualityText =
                    "Hazardous";

                break;


            default:

                airQualityText =
                    "Unknown";

        }


        aqi.textContent =
            `${airQuality} (${airQualityText})`;

    }

    else {

        aqi.textContent =
            "Unavailable";

    }



    // ========================================================
    // WEATHER ICON
    // ========================================================

    if (
        data.current.condition &&
        data.current.condition.icon
    ) {

        weatherIcon.src =
            "https:" +
            data.current.condition.icon;


        weatherIcon.alt =
            data.current.condition.text;

    }


    // ========================================================
    // TODAY'S HIGHLIGHTS
    // ========================================================

    updateHighlights(data);

}



// ============================================================
// UPDATE TODAY'S HIGHLIGHTS
// ============================================================

function updateHighlights(data) {

    const highlightCards =
        document.querySelectorAll(
            ".highlights .card"
        );


    if (
        !highlightCards ||
        highlightCards.length < 4
    ) {

        return;

    }


    // --------------------------------------------------------
    // AIR QUALITY
    // --------------------------------------------------------

    let airQualityText =
        "Good";


    if (
        data.current.air_quality
    ) {

        const aqiValue =
            data.current.air_quality[
                "us-epa-index"
            ];


        switch (aqiValue) {

            case 1:

                airQualityText =
                    "Good";

                break;


            case 2:

                airQualityText =
                    "Moderate";

                break;


            case 3:

                airQualityText =
                    "Unhealthy for Sensitive Groups";

                break;


            case 4:

                airQualityText =
                    "Unhealthy";

                break;


            case 5:

                airQualityText =
                    "Very Unhealthy";

                break;


            case 6:

                airQualityText =
                    "Hazardous";

                break;

        }

    }


    highlightCards[0]
        .querySelector("p")
        .textContent =
        airQualityText;



    // --------------------------------------------------------
    // CHANCE OF RAIN
    // --------------------------------------------------------

    const rainChance =
        data.forecast.forecastday[0]
            .day.daily_chance_of_rain;


    highlightCards[1]
        .querySelector("p")
        .textContent =
        rainChance + "%";



    // --------------------------------------------------------
    // VISIBILITY
    // --------------------------------------------------------

    const visibility =
        data.current.vis_km;


    highlightCards[2]
        .querySelector("p")
        .textContent =
        visibility + " km";



    // --------------------------------------------------------
    // FEELS LIKE
    // --------------------------------------------------------

    highlightCards[3]
        .querySelector("p")
        .textContent =
        data.current.feelslike_c + "°C";

}



// ============================================================
// CAPITALIZE CITY NAME
// ============================================================

function capitalize(text) {

    if (!text) {

        return "";

    }


    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );

}