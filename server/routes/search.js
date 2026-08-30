// ============================================================
// WEATHERSPHERE - SEARCH ROUTES
// ============================================================

const express = require("express");

const router = express.Router();


// ============================================================
// CONTROLLER
// ============================================================

const {
    searchLocations
} = require("../controllers/searchController");


// ============================================================
// LOCATION AUTOCOMPLETE
// ============================================================
//
// Example:
//
// GET /api/search/Jalgaon
// GET /api/search/New%20Delhi
// GET /api/search/Los%20Angeles
// GET /api/search/San%20Francisco
//
// The city/query can contain spaces and special characters.
// ============================================================

router.get("/:city", searchLocations);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;