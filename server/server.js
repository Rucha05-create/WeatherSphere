// ============================================================
// WEATHERSPHERE - SERVER.JS
// ============================================================

// ===============================
// IMPORTS
// ===============================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


// ===============================
// LOAD ENVIRONMENT VARIABLES
// ===============================

dotenv.config();


// ===============================
// DATABASE
// ===============================

const connectDB = require("./config/db");

connectDB();


// ===============================
// CREATE EXPRESS APP
// ===============================

const app = express();


// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json());


// ===============================
// ROUTES
// ===============================

const weatherRoutes = require("./routes/weather");
const searchRoutes = require("./routes/search");
const favouriteRoutes = require("./routes/favourite");


// Weather API
app.use("/api/weather", weatherRoutes);


// Search History API
app.use("/api/search", searchRoutes);


// Favourite Cities API
app.use("/api/favourites", favouriteRoutes);


// ===============================
// HOME ROUTE
// ===============================

app.get("/", (req, res) => {

    res.status(200).send(
        "🌤 WeatherSphere Backend is Running 🚀"
    );

});


// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", (req, res) => {

    res.status(200).json({

        success: true,

        message: "WeatherSphere API is working",

        timestamp: new Date().toISOString()

    });

});


// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "API route not found."

    });

});


// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {

    console.error(
        "Server Error:",
        err
    );

    res.status(500).json({

        success: false,

        message: "Internal server error."

    });

});


// ===============================
// START SERVER
// ===============================

const PORT =
    process.env.PORT || 5000;


app.listen(PORT, () => {

    console.log(
        `🚀 WeatherSphere server running on http://localhost:${PORT}`
    );

});