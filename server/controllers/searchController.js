// Delete One Search
const deleteSearch = async (req, res) => {

    try {

        await Search.findByIdAndDelete(req.params.id);

        res.json({
            message: "Deleted Successfully"
        });

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Delete All Searches
const clearSearchHistory = async (req, res) => {

    try {

        await Search.deleteMany({});

        res.json({
            message: "History Cleared Successfully"
        });

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {

    saveSearch,

    getSearchHistory,

    deleteSearch,

    clearSearchHistory

};