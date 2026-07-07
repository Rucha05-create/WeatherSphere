const Favourite = require("../models/Favourite");

// Save Favourite
const saveFavourite = async (req, res) => {

    try {

        const favourite = new Favourite(req.body);

        await favourite.save();

        res.json(favourite);

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Get All Favourites
const getFavourites = async (req, res) => {

    const favourites = await Favourite.find();

    res.json(favourites);

};

// Delete Favourite
const deleteFavourite = async (req, res) => {

    try {

        await Favourite.findByIdAndDelete(req.params.id);

        res.json({
            message: "Favourite deleted successfully"
        });

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Export Functions
module.exports = {

    saveFavourite,

    getFavourites,

    deleteFavourite

};