const axios = require("axios");

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

        // Get search text from URL
        // Example:
        // /api/search/Jalgaon
        // /api/search/New%20Delhi
        // /api/search/Jalgaon%20Jamod

        const query = decodeURIComponent(
            req.params.city || ""
        ).trim();


        // Validate query

        if (query.length < 2) {

            return res.json([]);

        }


        // Get API key

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
        // SORT RESULTS
        // ========================================================
        //
        // Works for ALL cities.
        //
        // Priority:
        // 1. Exact city name
        // 2. City name starts with search
        // 3. India
        // 4. Maharashtra
        //
        // Nothing is hard-coded to Jalgaon.
        // ========================================================

        const normalizedQuery =
            query.toLowerCase();


        locations.sort((a, b) => {

            const aName =
                (a.name || "").toLowerCase();

            const bName =
                (b.name || "").toLowerCase();


            // Exact match

            const aExact =
                aName === normalizedQuery;

            const bExact =
                bName === normalizedQuery;


            if (aExact && !bExact) {

                return -1;

            }

            if (!aExact && bExact) {

                return 1;

            }


            // Starts with search

            const aStarts =
                aName.startsWith(normalizedQuery);

            const bStarts =
                bName.startsWith(normalizedQuery);


            if (aStarts && !bStarts) {

                return -1;

            }

            if (!aStarts && bStarts) {

                return 1;

            }


            // India priority

            const aIndia =
                (a.country || "").toLowerCase() ===
                "india";

            const bIndia =
                (b.country || "").toLowerCase() ===
                "india";


            if (aIndia && !bIndia) {

                return -1;

            }

            if (!aIndia && bIndia) {

                return 1;

            }


            // Maharashtra priority

            const aMaharashtra =
                (a.region || "").toLowerCase() ===
                "maharashtra";

            const bMaharashtra =
                (b.region || "").toLowerCase() ===
                "maharashtra";


            if (aMaharashtra && !bMaharashtra) {

                return -1;

            }

            if (!aMaharashtra && bMaharashtra) {

                return 1;

            }


            return 0;

        });


        // ========================================================
        // NORMALIZE LOCATION DATA
        // ========================================================

        const results =
            locations.map(location => ({

                name:
                    location.name || "",

                district:
                    location.district ||
                    location.county ||
                    location.state_district ||
                    "",

                region:
                    location.region ||
                    "",

                country:
                    location.country ||
                    "",

                lat:
                    location.lat !== undefined
                        ? Number(location.lat)
                        : null,

                lon:
                    location.lon !== undefined
                        ? Number(location.lon)
                        : null,

                url:
                    location.url ||
                    ""

            }));


        console.log(
            "WeatherSphere - Location suggestions:",
            results
        );


        // Send results

        return res.json(results);

    }


    catch (error) {

        console.error(

            "WeatherSphere - Location search error:",

            error.response?.data ||
            error.message

        );


        if (error.response) {

            return res.status(
                error.response.status
            ).json(
                error.response.data
            );

        }


        return res.status(500).json({

            message:
                "Unable to search locations."

        });

    }

};


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    searchLocations

};