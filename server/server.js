// ===============================
// IMPORTS
// ===============================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// ===============================
// CONFIGURATION
// ===============================

dotenv.config();

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

    res.send("WeatherSphere Backend is Running 🚀");

});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`🚀 Server running on http://localhost:${PORT}`);

});