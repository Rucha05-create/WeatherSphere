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

        // --------------------------------------------------------
        // Get search text from URL
        // Example:
        // /api/search/Jalgaon
        // /api/search/New%20Delhi
        // --------------------------------------------------------

        const query = decodeURIComponent(
            req.params.city || ""
        ).trim();


        // --------------------------------------------------------
        // Validate query
        // --------------------------------------------------------

        if (query.length < 2) {

            return res.json([]);

        }


        // --------------------------------------------------------
        // Get API key
        // --------------------------------------------------------

        const apiKey = getApiKey();


        if (!apiKey) {

            return res.status(500).json({

                message: "WeatherAPI key is missing."

            });

        }


        console.log(
            "WeatherSphere - Location Search:",
            query
        );


        // ========================================================
        // WEATHERAPI SEARCH REQUEST
        // ========================================================

        const response = await axios.get(

            "https://api.weatherapi.com/v1/search.json",

            {

                params: {

                    key: apiKey,

                    q: query

                }

            }

        );


        // ========================================================
        // GET RESULTS
        // ========================================================

        let locations =
            Array.isArray(response.data)
                ? response.data
                : [];


        // ========================================================
        // NORMALIZED SEARCH QUERY
        // ========================================================

        const normalizedQuery =
            query
                .toLowerCase()
                .trim();


        // ========================================================
        // SORT / PRIORITIZE LOCATIONS
        // ========================================================
        //
        // This is generic and is NOT hard-coded for Jalgaon.
        //
        // Priority:
        //
        // 1. Exact location name
        // 2. Location name starts with search query
        // 3. Location name contains search query
        // 4. India
        // 5. Maharashtra
        //
        // Other matching locations are NOT removed.
        //
        // This helps with:
        //
        // Jalgaon
        // Jalgaon Jamod
        // New Delhi
        // New York
        // etc.
        //
        // ========================================================

        locations.sort((a, b) => {

            const aName =
                (a.name || "")
                    .toLowerCase()
                    .trim();


            const bName =
                (b.name || "")
                    .toLowerCase()
                    .trim();


            const aCountry =
                (a.country || "")
                    .toLowerCase()
                    .trim();


            const bCountry =
                (b.country || "")
                    .toLowerCase()
                    .trim();


            const aRegion =
                (a.region || "")
                    .toLowerCase()
                    .trim();


            const bRegion =
                (b.region || "")
                    .toLowerCase()
                    .trim();


            // ====================================================
            // 1. EXACT NAME MATCH
            // ====================================================

            const aExact =
                aName === normalizedQuery;

            const bExact =
                bName === normalizedQuery;


            if (aExact !== bExact) {

                return aExact ? -1 : 1;

            }


            // ====================================================
            // 2. NAME STARTS WITH QUERY
            // ====================================================

            const aStarts =
                aName.startsWith(
                    normalizedQuery
                );

            const bStarts =
                bName.startsWith(
                    normalizedQuery
                );


            if (aStarts !== bStarts) {

                return aStarts ? -1 : 1;

            }


            // ====================================================
            // 3. NAME CONTAINS QUERY
            // ====================================================

            const aContains =
                aName.includes(
                    normalizedQuery
                );

            const bContains =
                bName.includes(
                    normalizedQuery
                );


            if (aContains !== bContains) {

                return aContains ? -1 : 1;

            }


            // ====================================================
            // 4. INDIA PRIORITY
            // ====================================================

            const aIndia =
                aCountry === "india";

            const bIndia =
                bCountry === "india";


            if (aIndia !== bIndia) {

                return aIndia ? -1 : 1;

            }


            // ====================================================
            // 5. MAHARASHTRA PRIORITY
            // ====================================================
            //
            // This gives Maharashtra locations a small priority
            // without removing locations from other states.
            //
            // ====================================================

            const aMaharashtra =
                aRegion === "maharashtra";

            const bMaharashtra =
                bRegion === "maharashtra";


            if (aMaharashtra !== bMaharashtra) {

                return aMaharashtra ? -1 : 1;

            }


            // ====================================================
            // 6. ALPHABETICAL ORDER
            // ====================================================
            //
            // If two results have the same priority, sort them
            // alphabetically to keep the dropdown consistent.
            //
            // ====================================================

            return aName.localeCompare(bName);

        });


        // ========================================================
        // NORMALIZE LOCATION DATA
        // ========================================================
        //
        // WeatherAPI normally provides:
        //
        // name
        // region
        // country
        // lat
        // lon
        // url
        //
        // Some responses may also contain:
        //
        // district
        // county
        // state_district
        //
        // We keep the available information.
        // ========================================================

        const results =
            locations.map(location => ({

                // ------------------------------------------------
                // LOCATION NAME
                // ------------------------------------------------

                name:
                    location.name || "",


                // ------------------------------------------------
                // DISTRICT
                // ------------------------------------------------

                district:
                    location.district ||
                    location.county ||
                    location.state_district ||
                    "",


                // ------------------------------------------------
                // STATE / REGION
                // ------------------------------------------------

                region:
                    location.region ||
                    "",


                // ------------------------------------------------
                // COUNTRY
                // ------------------------------------------------

                country:
                    location.country ||
                    "",


                // ------------------------------------------------
                // LATITUDE
                // ------------------------------------------------

                lat:
                    location.lat !== undefined
                        ? Number(location.lat)
                        : null,


                // ------------------------------------------------
                // LONGITUDE
                // ------------------------------------------------

                lon:
                    location.lon !== undefined
                        ? Number(location.lon)
                        : null,


                // ------------------------------------------------
                // WEATHERAPI URL
                // ------------------------------------------------

                url:
                    location.url ||
                    ""

            }));


        // ========================================================
        // REMOVE DUPLICATE LOCATIONS
        // ========================================================
        //
        // Two identical results can occasionally appear.
        //
        // We use:
        //
        // name + region + country + coordinates
        //
        // so genuinely different locations with the same name
        // are NOT accidentally removed.
        // ========================================================

        const uniqueResults = [];

        const seenLocations = new Set();


        results.forEach(location => {

            const uniqueKey = [

                location.name
                    .toLowerCase()
                    .trim(),

                location.region
                    .toLowerCase()
                    .trim(),

                location.country
                    .toLowerCase()
                    .trim(),

                location.lat,

                location.lon

            ].join("|");


            if (!seenLocations.has(uniqueKey)) {

                seenLocations.add(uniqueKey);

                uniqueResults.push(location);

            }

        });


        // ========================================================
        // LIMIT RESULTS
        // ========================================================
        //
        // The frontend also limits results, but limiting here
        // prevents unnecessary data from being sent.
        //
        // ========================================================

        const finalResults =
            uniqueResults.slice(0, 10);


        // ========================================================
        // LOG RESULTS
        // ========================================================

        console.log(
            "WeatherSphere - Location suggestions:",
            finalResults
        );


        // ========================================================
        // SEND RESULTS
        // ========================================================

        return res.json(
            finalResults
        );

    }


    // ============================================================
    // ERROR HANDLING
    // ============================================================

    catch (error) {

        console.error(

            "WeatherSphere - Location search error:",

            error.response?.data ||
            error.message

        );


        // --------------------------------------------------------
        // WeatherAPI error
        // --------------------------------------------------------

        if (error.response) {

            return res.status(

                error.response.status

            ).json(

                error.response.data

            );

        }


        // --------------------------------------------------------
        // Server error
        // --------------------------------------------------------

        return res.status(500).json({

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

        const search = new Search({

            city:
                req.body.city,

            country:
                req.body.country

        });


        await search.save();


        return res.status(201).json(
            search
        );

    }


    catch (error) {

        return res.status(500).json({

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
            await Search.find().sort({

                createdAt: -1

            });


        return res.json(
            history
        );

    }


    catch (error) {

        return res.status(500).json({

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


        return res.json({

            message:
                "Deleted Successfully"

        });

    }


    catch (error) {

        return res.status(500).json({

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


        return res.json({

            message:
                "History Cleared Successfully"

        });

    }


    catch (error) {

        return res.status(500).json({

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