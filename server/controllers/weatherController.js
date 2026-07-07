const axios = require("axios");

const getWeather = async (req, res) => {

    try {

        const city = req.params.city;

        const apiKey = process.env.WEATHER_API_KEY;

        const response = await axios.get(

            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=yes&alerts=no`

        );

        res.json(response.data);

    }

    catch (err) {

        res.status(500).json({

            message: "Unable to fetch weather."

        });

    }

};

module.exports = {

    getWeather

};