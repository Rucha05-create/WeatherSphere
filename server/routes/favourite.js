// ===============================
// IMPORTS
// ===============================

const express = require("express");

const router = express.Router();

const {

    saveFavourite,

    getFavourites,

    deleteFavourite

} = require("../controllers/favouriteController");

// ===============================
// SAVE FAVOURITE CITY
// ===============================

router.post("/", saveFavourite);

// ===============================
// GET ALL FAVOURITE CITIES
// ===============================

router.get("/", getFavourites);

// ===============================
// DELETE FAVOURITE CITY
// ===============================

router.delete("/:id", deleteFavourite);

// ===============================
// EXPORT ROUTER
// ===============================

module.exports = router;