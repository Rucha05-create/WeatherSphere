const express = require("express");

const router = express.Router();

const {

    saveSearch,

    getSearchHistory,

    deleteSearch,

    clearSearchHistory

} = require("../controllers/searchController");

router.post("/", saveSearch);

router.get("/", getSearchHistory);

router.delete("/:id", deleteSearch);

router.delete("/", clearSearchHistory);

module.exports = router;