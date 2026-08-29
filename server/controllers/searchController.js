const axios = require("axios");
const Search = require("../models/SearchHistory");


// ============================================================
// WEATHER API KEY
// ============================================================

const getApiKey = () => {
    return process.env.WEATHER_API_KEY;
};


// ============================================================
// LOCATION SEARCH / AUTOCOMPLETE
// ============================================================

const searchLocations = async (req, res) => {

    try {

        // ====================================================
        // GET SEARCH QUERY
        // ====================================================

        const query =
            decodeURIComponent(req.params.city || "").trim();


        // ----------------------------------------------------
        // Minimum 2 characters
        // ----------------------------------------------------

        if (
            !query ||
            query.length < 2
        ) {

            return res.json([]);

        }


        // ====================================================
        // API KEY
        // ====================================================

        const apiKey =
            getApiKey();


        if (!apiKey) {

            return res.status(500).json({

                message:
                    "WeatherAPI key is missing."

            });

        }


        console.log(
            "WeatherSphere - Location search:",
            query
        );


        // ====================================================
        // SEARCH QUERIES
        // ====================================================

        let searchQueries = [query];


        // ====================================================
        // JALGAON DISAMBIGUATION
        // ====================================================
        //
        // When the user searches "Jalgaon", search for:
        //
        // 1. Jalgaon
        // 2. Jalgaon Jamod
        //
        // This makes it possible for the user to select
        // the correct Jalgaon.
        // ====================================================

        if (
            query.toLowerCase() === "jalgaon"
        ) {

            searchQueries = [

                "Jalgaon",

                "Jalgaon Jamod"

            ];

        }


        // ====================================================
        // FETCH LOCATIONS
        // ====================================================

        const responses =
            await Promise.all(

                searchQueries.map(
                    searchQuery =>

                        axios.get(

                            "https://api.weatherapi.com/v1/search.json",

                            {

                                params: {

                                    key: apiKey,

                                    q: searchQuery

                                }

                            }

                        )

                )

            );


        // ====================================================
        // COMBINE ALL RESULTS
        // ====================================================

        let locations = [];


        responses.forEach(
            response => {

                if (
                    Array.isArray(response.data)
                ) {

                    locations.push(
                        ...response.data
                    );

                }

            }
        );


        // ====================================================
        // REMOVE DUPLICATES
        // ====================================================

        const seen = new Set();


        locations =
            locations.filter(
                location => {

                    const key =

                        `${location.name || ""}|` +
                        `${location.region || ""}|` +
                        `${location.country || ""}|` +
                        `${location.lat || ""}|` +
                        `${location.lon || ""}`;


                    if (
                        seen.has(key)
                    ) {

                        return false;

                    }


                    seen.add(key);

                    return true;

                }
            );


        // ====================================================
        // NORMALIZE LOCATION DATA
        // ====================================================

        const results =
            locations.map(
                location => {

                    let district =
                        location.district ||
                        location.county ||
                        "";


                    // ------------------------------------------------
                    // Known district information
                    // ------------------------------------------------

                    if (
                        location.name &&
                        location.name.toLowerCase() ===
                        "jalgaon"
                    ) {

                        district =
                            "Jalgaon";

                    }


                    if (
                        location.name &&
                        location.name.toLowerCase() ===
                        "jalgaon jamod"
                    ) {

                        district =
                            "Buldhana";

                    }


                    return {

                        name:
                            location.name || "",

                        district:
                            district,

                        region:
                            location.region || "",

                        country:
                            location.country || "",

                        lat:
                            location.lat !== undefined
                                ? Number(location.lat)
                                : null,

                        lon:
                            location.lon !== undefined
                                ? Number(location.lon)
                                : null

                    };

                }
            );


        // ====================================================
        // SORT JALGAON RESULTS
        // ====================================================
        //
        // Put exact "Jalgaon" first and "Jalgaon Jamod"
        // immediately after it.
        // ====================================================

        if (
            query.toLowerCase() === "jalgaon"
        ) {

            results.sort(
                (a, b) => {

                    const aName =
                        a.name.toLowerCase();

                    const bName =
                        b.name.toLowerCase();


                    if (
                        aName === "jalgaon"
                    ) {

                        return -1;

                    }


                    if (
                        bName === "jalgaon"
                    ) {

                        return 1;

                    }


                    if (
                        aName === "jalgaon jamod"
                    ) {

                        return -1;

                    }


                    if (
                        bName === "jalgaon jamod"
                    ) {

                        return 1;

                    }


                    return 0;

                }
            );

        }


        // ====================================================
        // LOG RESULTS
        // ====================================================

        console.log(
            "WeatherSphere - Location suggestions:",
            results
        );


        // ====================================================
        // SEND RESULTS
        // ====================================================

        res.json(
            results
        );

    }


    // ========================================================
    // ERROR HANDLING
    // ========================================================

    catch (error) {

        console.error(

            "WeatherSphere - Location search error:",

            error.response?.data ||
            error.message

        );


        if (
            error.response
        ) {

            return res.status(
                error.response.status
            ).json({

                message:
                    error.response.data?.error?.message ||
                    "Unable to search locations."

            });

        }


        res.status(500).json({

            message:
                "Unable to search locations."

        });

    }

};



// ============================================================
// SAVE SEARCH
// ============================================================

const saveSearch = async (req, res) => {

    try {

        const search =
            new Search({

                city:
                    req.body.city,

                country:
                    req.body.country

            });


        await search.save();


        res.status(201).json(
            search
        );

    }


    catch (error) {

        res.status(500).json({

            message:
                error.message

        });

    }

};



// ============================================================
// GET SEARCH HISTORY
// ============================================================

const getSearchHistory = async (req, res) => {

    try {

        const history =
            await Search
                .find()
                .sort({

                    createdAt: -1

                });


        res.json(
            history
        );

    }


    catch (error) {

        res.status(500).json({

            message:
                error.message

        });

    }

};



// ============================================================
// DELETE ONE SEARCH
// ============================================================

const deleteSearch = async (req, res) => {

    try {

        await Search.findByIdAndDelete(
            req.params.id
        );


        res.json({

            message:
                "Deleted Successfully"

        });

    }


    catch (error) {

        res.status(500).json({

            message:
                error.message

        });

    }

};



// ============================================================
// CLEAR SEARCH HISTORY
// ============================================================

const clearSearchHistory = async (req, res) => {

    try {

        await Search.deleteMany({});


        res.json({

            message:
                "History Cleared Successfully"

        });

    }


    catch (error) {

        res.status(500).json({

            message:
                error.message

        });

    }

};



// ============================================================
// EXPORT
// ============================================================

module.exports = {

    searchLocations,

    saveSearch,

    getSearchHistory,

    deleteSearch,

    clearSearchHistory

};