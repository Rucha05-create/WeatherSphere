// ============================================================
// CONFIG.JS
// WeatherSphere - DOM Elements & Configuration
// ============================================================


// ============================================================
// API CONFIGURATION
// ============================================================

// WeatherAPI key
// NOTE: For a production project, keep this key in the server/.env
// instead of exposing it in frontend JavaScript.

const API_KEY = "852130d5e5f542239fc191934260410";


// ============================================================
// DOM ELEMENTS
// ============================================================

// Search
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const favBtn = document.getElementById("favBtn");

// Theme
const themeBtn = document.getElementById("themeBtn");

// Search History
const clearHistoryBtn =
    document.getElementById("clearHistoryBtn");

const historyContainer =
    document.getElementById("historyContainer");


// ============================================================
// CURRENT WEATHER
// ============================================================

const cityName =
    document.getElementById("cityName");

const countryName =
    document.getElementById("countryName");

const weatherIcon =
    document.getElementById("weatherIcon");

const temperature =
    document.getElementById("temperature");

const condition =
    document.getElementById("condition");

const humidity =
    document.getElementById("humidity");

const wind =
    document.getElementById("wind");

const pressure =
    document.getElementById("pressure");

const feelsLike =
    document.getElementById("feelsLike");

const sunrise =
    document.getElementById("sunrise");

const sunset =
    document.getElementById("sunset");

const uv =
    document.getElementById("uv");

const aqi =
    document.getElementById("aqi");


// ============================================================
// MOON INFORMATION
// ============================================================

const moonPhase =
    document.getElementById("moonPhase");

const moonrise =
    document.getElementById("moonrise");

const moonset =
    document.getElementById("moonset");

const moonIllumination =
    document.getElementById("moonIllumination");


// ============================================================
// HOURLY FORECAST
// ============================================================

const hourContainer =
    document.getElementById("hourContainer");


// ============================================================
// WEEKLY FORECAST
// ============================================================

const weeklyForecast =
    document.getElementById("weeklyForecast");


// ============================================================
// FAVORITES
// ============================================================

const favoriteContainer =
    document.getElementById("favoriteContainer");


// ============================================================
// WEATHER ALERTS
// ============================================================

const alertsContainer =
    document.getElementById("alertsContainer");


// ============================================================
// MAP
// ============================================================

const weatherMap =
    document.getElementById("weatherMap");


// ============================================================
// CHART
// ============================================================

const temperatureChart =
    document.getElementById("temperatureChart");


// ============================================================
// AUTOCOMPLETE
// ============================================================

const suggestions =
    document.getElementById("suggestions");


// ============================================================
// DEBUG CHECK
// ============================================================

// This helps identify missing HTML elements instead of
// getting confusing "null" errors in the console.

console.log("WeatherSphere configuration loaded.");

console.log("API Key loaded:", API_KEY ? "YES" : "NO");

console.log("Search button:", searchBtn ? "OK" : "MISSING");
console.log("City input:", cityInput ? "OK" : "MISSING");
console.log("Weather card:", cityName ? "OK" : "MISSING");
console.log("Hourly container:", hourContainer ? "OK" : "MISSING");
console.log("Weekly forecast:", weeklyForecast ? "OK" : "MISSING");
console.log("Weather map:", weatherMap ? "OK" : "MISSING");
console.log("Temperature chart:", temperatureChart ? "OK" : "MISSING");