// ============================================================
// WEATHERSPHERE - API.JS
// ============================================================
// Handles communication with WeatherAPI.
//
// IMPORTANT:
// This file does NOT contain getWeather().
//
// getWeather() is handled by weather.js.
//
// This file provides reusable API functions:
//
// 1. fetchWeatherData()
// 2. fetchLocationSuggestions()
// 3. fetchWeatherByCoordinates()
// 4. testWeatherAPI()
//
// It also safely encodes location names containing spaces,
// special characters, etc.
// ============================================================


// ============================================================
// WEATHER API BASE URL
// ============================================================

const WEATHER_API_BASE_URL =
    "https://api.weatherapi.com/v1";


// ============================================================
// CHECK API KEY
// ============================================================

function checkApiKey() {

    if (
        typeof API_KEY === "undefined" ||
        !API_KEY ||
        String(API_KEY).trim() === ""
    ) {

        console.error(
            "WeatherSphere: API_KEY is missing."
        );

        return false;
    }

    return true;
}


// ============================================================
// CLEAN QUERY
// ============================================================
// Removes unnecessary spaces before sending a location to
// WeatherAPI.
//
// Example:
//
// "   New Delhi   "
// becomes
//
// "New Delhi"
// ============================================================

function cleanLocationQuery(value) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";

    }


    return String(value).trim();

}


// ============================================================
// FETCH WEATHER DATA
// ============================================================
// Fetches 7-day weather information.
//
// Example:
//
// const data = await fetchWeatherData("New Delhi");
//
// encodeURIComponent() ensures locations containing spaces,
// commas and special characters are passed correctly.
//
// Example:
//
// "New Delhi"
//       ↓
// "New%20Delhi"
// ============================================================

async function fetchWeatherData(city) {

    // --------------------------------------------------------
    // Check API key
    // --------------------------------------------------------

    if (!checkApiKey()) {

        throw new Error(
            "Weather API key is missing. Please check config.js."
        );

    }


    // --------------------------------------------------------
    // Clean location
    // --------------------------------------------------------

    const query =
        cleanLocationQuery(city);


    // --------------------------------------------------------
    // Validate location
    // --------------------------------------------------------

    if (!query) {

        throw new Error(
            "Please enter a city name."
        );

    }


    // --------------------------------------------------------
    // Encode location
    // --------------------------------------------------------
    //
    // This is important for:
    //
    // New Delhi
    // Navi Mumbai
    // New York
    // Chhatrapati Sambhajinagar
    //
    // etc.
    //
    // encodeURIComponent() converts spaces and special
    // characters into URL-safe values.
    // --------------------------------------------------------

    const encodedQuery =
        encodeURIComponent(query);


    // --------------------------------------------------------
    // Build WeatherAPI URL
    // --------------------------------------------------------

    const url =
        `${WEATHER_API_BASE_URL}/forecast.json` +
        `?key=${encodeURIComponent(String(API_KEY).trim())}` +
        `&q=${encodedQuery}` +
        `&days=7` +
        `&aqi=yes` +
        `&alerts=yes`;


    console.log(
        "WeatherSphere - API Request:",
        query
    );


    // --------------------------------------------------------
    // Send request
    // --------------------------------------------------------

    let response;

    try {

        response =
            await fetch(url);

    }

    catch (networkError) {

        console.error(
            "WeatherSphere - Network error:",
            networkError
        );

        throw new Error(
            "Unable to connect to WeatherAPI. " +
            "Please check your internet connection."
        );

    }


    // --------------------------------------------------------
    // Read JSON response
    // --------------------------------------------------------

    let data = null;

    try {

        data =
            await response.json();

    }

    catch (jsonError) {

        console.error(
            "WeatherSphere - Invalid API response:",
            jsonError
        );

        throw new Error(
            `WeatherAPI returned an invalid response (${response.status}).`
        );

    }


    // --------------------------------------------------------
    // Handle HTTP errors
    // --------------------------------------------------------

    if (!response.ok) {

        const apiMessage =
            data &&
            data.error &&
            data.error.message
                ? data.error.message
                : `WeatherAPI request failed (${response.status}).`;


        console.error(
            "WeatherSphere - WeatherAPI Error:",
            response.status,
            apiMessage
        );


        // ----------------------------------------------------
        // More useful messages for common errors
        // ----------------------------------------------------

        if (response.status === 400) {

            throw new Error(
                "Location could not be found. " +
                "Please check the location name and try again."
            );

        }


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            throw new Error(
                "WeatherAPI authentication failed. " +
                "Please check your API key."
            );

        }


        if (response.status === 404) {

            throw new Error(
                "Weather service endpoint was not found."
            );

        }


        if (response.status >= 500) {

            throw new Error(
                "WeatherAPI server is currently unavailable. " +
                "Please try again later."
            );

        }


        throw new Error(apiMessage);

    }


    // --------------------------------------------------------
    // Handle WeatherAPI-level error
    // --------------------------------------------------------
    // WeatherAPI can sometimes return an error object even
    // when the HTTP request itself was completed.
    // --------------------------------------------------------

    if (
        data &&
        data.error
    ) {

        throw new Error(
            data.error.message ||
            "Unable to retrieve weather information."
        );

    }


    // --------------------------------------------------------
    // Validate response
    // --------------------------------------------------------

    if (
        !data ||
        !data.location ||
        !data.current ||
        !data.forecast ||
        !Array.isArray(data.forecast.forecastday)
    ) {

        console.error(
            "WeatherSphere - Incomplete weather data:",
            data
        );


        throw new Error(
            "WeatherAPI returned incomplete weather data."
        );

    }


    // --------------------------------------------------------
    // Successful response
    // --------------------------------------------------------

    console.log(
        "WeatherSphere - API Response:",
        data
    );


    return data;

}


// ============================================================
// FETCH LOCATION SUGGESTIONS
// ============================================================
// Used by autocomplete.js.
//
// Example:
//
// const locations =
//     await fetchLocationSuggestions("New Del");
//
// Returns WeatherAPI location suggestions.
// ============================================================

async function fetchLocationSuggestions(query) {

    // --------------------------------------------------------
    // Check API key
    // --------------------------------------------------------

    if (!checkApiKey()) {

        throw new Error(
            "Weather API key is missing."
        );

    }


    // --------------------------------------------------------
    // Clean query
    // --------------------------------------------------------

    const searchQuery =
        cleanLocationQuery(query);


    // --------------------------------------------------------
    // Empty query
    // --------------------------------------------------------

    if (!searchQuery) {

        return [];

    }


    // --------------------------------------------------------
    // Encode query
    // --------------------------------------------------------

    const encodedQuery =
        encodeURIComponent(searchQuery);


    // --------------------------------------------------------
    // Build search URL
    // --------------------------------------------------------

    const url =
        `${WEATHER_API_BASE_URL}/search.json` +
        `?key=${encodeURIComponent(String(API_KEY).trim())}` +
        `&q=${encodedQuery}`;


    console.log(
        "WeatherSphere - Autocomplete Request:",
        searchQuery
    );


    // --------------------------------------------------------
    // Send request
    // --------------------------------------------------------

    let response;

    try {

        response =
            await fetch(url);

    }

    catch (networkError) {

        console.error(
            "WeatherSphere - Autocomplete network error:",
            networkError
        );

        throw new Error(
            "Unable to connect to the location search service."
        );

    }


    // --------------------------------------------------------
    // Read response
    // --------------------------------------------------------

    let data = null;

    try {

        data =
            await response.json();

    }

    catch (jsonError) {

        console.error(
            "WeatherSphere - Autocomplete response error:",
            jsonError
        );

        throw new Error(
            "Unable to read location suggestions."
        );

    }


    // --------------------------------------------------------
    // Handle HTTP errors
    // --------------------------------------------------------

    if (!response.ok) {

        const message =
            data &&
            data.error &&
            data.error.message
                ? data.error.message
                : `Location search failed (${response.status}).`;


        console.error(
            "WeatherSphere - Location Search Error:",
            message
        );


        throw new Error(message);

    }


    // --------------------------------------------------------
    // WeatherAPI search endpoint returns an array
    // --------------------------------------------------------

    if (!Array.isArray(data)) {

        console.warn(
            "WeatherSphere - Unexpected location search response:",
            data
        );

        return [];

    }


    return data;

}


// ============================================================
// FETCH WEATHER BY COORDINATES
// ============================================================
// Useful for:
//
// 1. Current Location
// 2. Autocomplete selection
// 3. Map selection
//
// Example:
//
// fetchWeatherByCoordinates(
//     18.5204,
//     73.8567
// );
// ============================================================

async function fetchWeatherByCoordinates(
    latitude,
    longitude
) {

    // --------------------------------------------------------
    // Check API key
    // --------------------------------------------------------

    if (!checkApiKey()) {

        throw new Error(
            "Weather API key is missing."
        );

    }


    // --------------------------------------------------------
    // Validate coordinates
    // --------------------------------------------------------

    if (
        latitude === undefined ||
        longitude === undefined ||
        latitude === null ||
        longitude === null ||
        latitude === "" ||
        longitude === ""
    ) {

        throw new Error(
            "Invalid location coordinates."
        );

    }


    // --------------------------------------------------------
    // Convert to numbers
    // --------------------------------------------------------

    const lat =
        Number(latitude);

    const lon =
        Number(longitude);


    // --------------------------------------------------------
    // Check numeric values
    // --------------------------------------------------------

    if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lon)
    ) {

        throw new Error(
            "Latitude and longitude must be valid numbers."
        );

    }


    // --------------------------------------------------------
    // Validate latitude range
    // --------------------------------------------------------

    if (
        lat < -90 ||
        lat > 90
    ) {

        throw new Error(
            "Latitude must be between -90 and 90."
        );

    }


    // --------------------------------------------------------
    // Validate longitude range
    // --------------------------------------------------------

    if (
        lon < -180 ||
        lon > 180
    ) {

        throw new Error(
            "Longitude must be between -180 and 180."
        );

    }


    // --------------------------------------------------------
    // Create coordinate query
    // --------------------------------------------------------

    const query =
        `${lat},${lon}`;


    // --------------------------------------------------------
    // Reuse weather function
    // --------------------------------------------------------

    return fetchWeatherData(query);

}


// ============================================================
// TEST WEATHER API
// ============================================================
// Run from browser console:
//
// testWeatherAPI();
//
// ============================================================

async function testWeatherAPI() {

    console.log(
        "=========================================="
    );

    console.log(
        "WeatherSphere - Testing Weather API..."
    );

    console.log(
        "=========================================="
    );


    // --------------------------------------------------------
    // Check API key
    // --------------------------------------------------------

    if (!checkApiKey()) {

        console.error(
            "❌ API key is missing."
        );

        return;

    }


    console.log(
        "✅ API key found."
    );


    try {

        // ----------------------------------------------------
        // Test city
        // ----------------------------------------------------

        const data =
            await fetchWeatherData("Pune");


        // ----------------------------------------------------
        // Successful connection
        // ----------------------------------------------------

        console.log(
            "✅ WeatherAPI connection successful."
        );


        console.log(
            "Location:",
            data.location.name,
            data.location.country
        );


        console.log(
            "Temperature:",
            data.current.temp_c + "°C"
        );


    }

    catch (error) {

        console.error(
            "❌ WeatherAPI connection failed:",
            error
        );

    }

}


// ============================================================
// TEST LOCATION WITH SPACES
// ============================================================
// This specifically checks whether locations containing
// spaces are being handled correctly.
//
// Run:
//
// testWeatherLocationWithSpaces();
//
// ============================================================

async function testWeatherLocationWithSpaces() {

    console.log(
        "=========================================="
    );

    console.log(
        "Testing location with spaces..."
    );

    console.log(
        "=========================================="
    );


    try {

        const city =
            "New Delhi";


        console.log(
            "Original location:",
            city
        );


        console.log(
            "Encoded location:",
            encodeURIComponent(city)
        );


        const data =
            await fetchWeatherData(city);


        console.log(
            "✅ Location with spaces works."
        );


        console.log(
            "Returned location:",
            data.location.name,
            data.location.country
        );


    }

    catch (error) {

        console.error(
            "❌ Location with spaces failed:",
            error
        );

    }

}


// ============================================================
// END OF API.JS
// ============================================================