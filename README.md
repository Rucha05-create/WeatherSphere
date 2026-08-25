# 🌤️ WeatherSphere

### 🌎 Global Weather Forecast & Weather Information Web Application

WeatherSphere is a modern, interactive and responsive weather forecasting web application that allows users to search for any city, state, district, village or country and view detailed real-time weather information.

The application uses the **WeatherAPI** to retrieve live weather data and presents it through an attractive glassmorphism-style interface with animated backgrounds, interactive cards, maps, charts and forecast sections.

WeatherSphere is designed to provide much more than just temperature information. It gives users a complete overview of current weather conditions, hourly forecasts, weekly forecasts, air quality, UV index, moon information, sunrise/sunset, weather alerts and more.

---

# 📌 Table of Contents

1. [Project Overview](#-project-overview)
2. [Project Objectives](#-project-objectives)
3. [Main Features](#-main-features)
4. [Technologies Used](#-technologies-used)
5. [Project Structure](#-project-structure)
6. [How the Application Works](#-how-the-application-works)
7. [Features Explained](#-features-explained)
8. [HTML Structure](#-html-structure)
9. [CSS Design](#-css-design)
10. [JavaScript Files](#-javascript-files)
11. [API Integration](#-api-integration)
12. [Search and Autocomplete](#-search-and-autocomplete)
13. [Current Weather](#-current-weather)
14. [Hourly Forecast](#-hourly-forecast)
15. [Weekly Forecast](#-weekly-forecast)
16. [Weather Map](#-weather-map)
17. [Temperature Chart](#-temperature-chart)
18. [Weather Alerts](#-weather-alerts)
19. [Favorites](#-favorites)
20. [Search History](#-search-history)
21. [Current Location](#-current-location)
22. [Moon Information](#-moon-information)
23. [Air Quality](#-air-quality)
24. [Responsive Design](#-responsive-design)
25. [How to Run the Project](#-how-to-run-the-project)
26. [API Key Configuration](#-api-key-configuration)
27. [GitHub Setup](#-github-setup)
28. [How to Update the Project](#-how-to-update-the-project)
29. [Future Enhancements](#-future-enhancements)
30. [Advantages](#-advantages)
31. [Limitations](#-limitations)
32. [Learning Outcomes](#-learning-outcomes)
33. [Use Cases](#-use-cases)
34. [Conclusion](#-conclusion)
35. [Author](#-author)

---

# 🌎 Project Overview

WeatherSphere is a web-based weather forecasting application developed using HTML, CSS and JavaScript.

The main purpose of the project is to provide users with an easy-to-use platform where they can search for a location and immediately receive detailed weather information.

Instead of displaying only the current temperature, WeatherSphere combines multiple weather-related services into a single dashboard.

Users can search locations using:

- City name
- State name
- District name
- Village name
- Country name
- Location suggestions

After selecting a location, the application displays detailed information such as:

- Current temperature
- Weather condition
- Humidity
- Wind speed
- Atmospheric pressure
- Feels-like temperature
- Sunrise
- Sunset
- UV index
- Air quality
- Moon phase
- Moonrise
- Moonset
- Moon illumination
- Rain probability
- Visibility
- Hourly forecast
- Seven-day forecast
- Weather map
- Temperature trend
- Weather alerts

---

# 🎯 Project Objectives

The major objectives of WeatherSphere are:

### 1. Provide Real-Time Weather Information

The application retrieves weather information from an external weather API and displays updated information to users.

### 2. Make Weather Searching Easy

Users can simply type the name of a location and receive suggestions automatically.

### 3. Provide Detailed Forecast Information

The application provides both:

- 24-hour forecast
- 7-day forecast

### 4. Improve User Experience

The interface uses:

- Glassmorphism
- Animated backgrounds
- Responsive layouts
- Interactive cards
- Icons
- Dropdown suggestions
- Interactive maps
- Charts

### 5. Provide Location-Based Weather

Users can use their device's location to automatically retrieve weather information.

### 6. Store User Preferences

Favorite locations and search history are stored using browser local storage.

---

# ✨ Main Features

WeatherSphere contains the following major features:

| Feature | Description |
|---|---|
| 🌡 Current Weather | Displays live weather conditions |
| 🔍 City Search | Search for any supported location |
| 📍 Autocomplete | Displays location suggestions while typing |
| 🗺 Weather Map | Shows searched location on an interactive map |
| ⏰ Hourly Forecast | Displays upcoming 24 hours |
| 📅 Weekly Forecast | Displays 7-day weather forecast |
| 📈 Temperature Chart | Displays temperature trends |
| ⭐ Favorites | Save frequently used locations |
| 🕒 Search History | Stores recently searched locations |
| 📍 Current Location | Detects user's current location |
| ⚠ Weather Alerts | Displays weather warnings |
| 🌫 Air Quality | Displays air quality information |
| ☀ UV Index | Displays UV level |
| 🌙 Moon Information | Displays moon phase and timings |
| 🌅 Sunrise/Sunset | Displays sunrise and sunset |
| 🌙 Dark/Light Theme | Allows theme switching |
| 📱 Responsive UI | Works on different screen sizes |

---

# 🛠 Technologies Used

## Frontend

### HTML5

HTML is used to create the basic structure of the website.

Major HTML components include:

- Navigation bar
- Search section
- Weather card
- Forecast sections
- Map container
- Chart container
- Favorites section
- Footer

---

### CSS3

CSS is used to design the application.

The project uses:

- Flexbox
- CSS Grid
- Media Queries
- Gradients
- Animations
- Glassmorphism
- Hover effects
- Responsive layouts
- Custom scrollbars

---

### JavaScript

JavaScript controls the application's functionality.

JavaScript is responsible for:

- API requests
- Searching locations
- Updating weather information
- Generating forecast cards
- Generating forecast tables
- Managing favorites
- Managing search history
- Creating charts
- Updating maps
- Handling weather alerts
- Autocomplete suggestions
- Geolocation

---

# 📦 External Libraries and Services

WeatherSphere uses several external services.

### WeatherAPI

Weather information is retrieved using:

WeatherAPI

It provides:

- Current weather
- Forecast
- Location search
- Air quality
- Astronomy information
- Weather alerts

---

### Leaflet.js

Leaflet is used to create the interactive weather map.

---

### Chart.js

Chart.js is used to create the temperature trend chart.

---

### Font Awesome

Font Awesome provides icons used in:

- Search button
- Location button
- Autocomplete
- Other UI elements

---

### Google Fonts

The project uses the Poppins font for the user interface.

---

# 📁 Project Structure

The project is organized as follows:

```text
WeatherSphere/
│
├── index.html
├── style.css
│
├── images/
│   └── sun.png
│
└── js/
    │
    ├── config.js
    ├── utils.js
    ├── api.js
    ├── weather.js
    ├── forecast.js
    ├── theme.js
    ├── favourites.js
    ├── searchHistory.js
    ├── charts.js
    ├── map.js
    ├── alerts.js
    ├── autocomplete.js
    └── app.js
