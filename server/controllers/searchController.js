const Search = require("../models/SearchHistory");

// ===============================
// Save Search
// ===============================

const saveSearch = async (req, res) => {

    try {

        const search = new Search({
            city: req.body.city,
            country: req.body.country
        });

        await search.save();

        res.status(201).json(search);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ===============================
// Get Search History
// ===============================

const getSearchHistory = async (req, res) => {

    try {

        const history = await Search.find().sort({
            createdAt: -1
        });

        res.json(history);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ===============================
// Delete One Search
// ===============================

const deleteSearch = async (req, res) => {

    try {

        await Search.findByIdAndDelete(req.params.id);

        res.json({
            message: "Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ===============================
// Clear Search History
// ===============================

const clearSearchHistory = async (req, res) => {

    try {

        await Search.deleteMany({});

        res.json({
            message: "History Cleared Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ===============================
// Export
// ===============================

module.exports = {

    saveSearch,

    getSearchHistory,

    deleteSearch,

    clearSearchHistory

};