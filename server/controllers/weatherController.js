const axios = require("axios");


// ============================================================
// GET WEATHER
// ============================================================

const getWeather = async (req, res) => {

    try {

        // Decode the location received from frontend
        const city = decodeURIComponent(req.params.city);

        const apiKey = process.env.WEATHER_API_KEY;


        // ----------------------------------------------------
        // Check API key
        // ----------------------------------------------------

        if (!apiKey) {

            return res.status(500).json({

                error: {
                    message: "Weather API key is missing."
                }

            });

        }


        console.log(
            "WeatherSphere - Weather Request:",
            city
        );


        // ----------------------------------------------------
        // WeatherAPI request
        // ----------------------------------------------------

        const response = await axios.get(

            "https://api.weatherapi.com/v1/forecast.json",

            {

                params: {

                    key: apiKey,

                    // Full selected location
                    q: city,

                    days: 7,

                    aqi: "yes",

                    alerts: "yes"

                }

            }

        );


        // ----------------------------------------------------
        // Send weather data
        // ----------------------------------------------------

        res.json(response.data);

    }


    catch (err) {

        console.error(
            "WeatherSphere - Weather Error:",
            err.response?.data || err.message
        );


        // ----------------------------------------------------
        // WeatherAPI error
        // ----------------------------------------------------

        if (err.response) {

            return res.status(
                err.response.status
            ).json(

                err.response.data

            );

        }


        // ----------------------------------------------------
        // Server error
        // ----------------------------------------------------

        res.status(500).json({

            error: {

                message:
                    "Unable to fetch weather information."

            }

        });

    }

};



// ============================================================
// SEARCH LOCATIONS
// Used for autocomplete
// ============================================================

const searchLocations = async (req, res) => {

    try {

        const query =
            decodeURIComponent(req.params.query).trim();


        const apiKey =
            process.env.WEATHER_API_KEY;


        // ----------------------------------------------------
        // Validate query
        // ----------------------------------------------------

        if (!query) {

            return res.json([]);

        }


        if (!apiKey) {

            return res.status(500).json({

                error: {

                    message:
                        "Weather API key is missing."

                }

            });

        }


        console.log(
            "WeatherSphere - Location Search:",
            query
        );


        // ----------------------------------------------------
        // WeatherAPI Search API
        // ----------------------------------------------------

        const response = await axios.get(

            "https://api.weatherapi.com/v1/search.json",

            {

                params: {

                    key: apiKey,

                    q: query

                }

            }

        );


        // ----------------------------------------------------
        // Return useful location information
        // ----------------------------------------------------

        const locations =
            response.data.map(location => ({

                name:
                    location.name,

                region:
                    location.region,

                country:
                    location.country,

                lat:
                    location.lat,

                lon:
                    location.lon,

                url:
                    location.url

            }));


        res.json(locations);

    }


    catch (err) {

        console.error(
            "WeatherSphere - Location Search Error:",
            err.response?.data || err.message
        );


        if (err.response) {

            return res.status(
                err.response.status
            ).json(

                err.response.data

            );

        }


        res.status(500).json({

            error: {

                message:
                    "Unable to search locations."

            }

        });

    }

};



// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getWeather,

    searchLocations

};