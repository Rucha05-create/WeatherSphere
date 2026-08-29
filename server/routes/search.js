const express = require("express");

const router = express.Router();

const {

    searchLocations,

    saveSearch,

    getSearchHistory,

    deleteSearch,

    clearSearchHistory

} = require("../controllers/searchController");


// ============================================================
// LOCATION AUTOCOMPLETE
// ============================================================

router.get("/:city", searchLocations);


// ============================================================
// SEARCH HISTORY
// ============================================================

router.post("/", saveSearch);

router.get("/", getSearchHistory);

router.delete("/:id", deleteSearch);

router.delete("/", clearSearchHistory);


module.exports = router;