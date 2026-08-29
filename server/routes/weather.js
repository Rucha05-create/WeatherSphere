const express = require("express");

const router = express.Router();

const {
    getWeather,
    searchLocations
} = require("../controllers/weatherController");


// ============================================================
// LOCATION SEARCH / AUTOCOMPLETE
// IMPORTANT: Keep this BEFORE /:city
// ============================================================

router.get("/search/:query", searchLocations);


// ============================================================
// WEATHER
// ============================================================

router.get("/:city", getWeather);


module.exports = router;