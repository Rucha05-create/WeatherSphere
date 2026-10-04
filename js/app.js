// ============================================================
// WEATHERSPHERE - APP.JS
// ============================================================
// Connects the buttons and keyboard to the other files.
// Autocomplete lives ONLY in autocomplete.js.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("WeatherSphere application started.");

    if (!cityInput) {
        console.error("cityInput not found.");
        return;
    }

    if (!searchBtn) {
        console.error("searchBtn not found.");
        return;
    }


    // =========================================================
    // HIDE SUGGESTIONS (function is provided by autocomplete.js)
    // =========================================================

    function hideSuggestions() {

        if (typeof window.hideWeatherSuggestions === "function") {
            window.hideWeatherSuggestions();
        }

    }


    // =========================================================
    // SEARCH BUTTON
    // =========================================================

    searchBtn.addEventListener("click", () => {

        const city = cityInput.value.trim();

        if (city === "") {
            alert("Please enter a city name.");
            cityInput.focus();
            return;
        }

        hideSuggestions();
        getWeather(city);

    });


    // =========================================================
    // ENTER KEY SEARCH
    // =========================================================
    // If autocomplete.js already handled Enter (a suggestion was
    // selected with the arrow keys), do nothing here.

    cityInput.addEventListener("keydown", (event) => {

        if (event.key !== "Enter" || event.defaultPrevented) {
            return;
        }

        event.preventDefault();

        const city = cityInput.value.trim();

        if (city === "") {
            alert("Please enter a city name.");
            return;
        }

        hideSuggestions();
        getWeather(city);

    });


    // =========================================================
    // CURRENT LOCATION
    // =========================================================

    if (locationBtn) {

        locationBtn.addEventListener("click", () => {

            hideSuggestions();

            if (!navigator.geolocation) {
                alert("Geolocation is not supported by your browser.");
                return;
            }

            const originalText = locationBtn.innerHTML;

            locationBtn.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Getting Location...';

            locationBtn.disabled = true;

            navigator.geolocation.getCurrentPosition(

                // Success
                async (position) => {

                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    console.log("Current Location:", latitude, longitude);

                    try {
                        await getWeather(`${latitude},${longitude}`);
                    } finally {
                        locationBtn.innerHTML = originalText;
                        locationBtn.disabled = false;
                    }

                },

                // Error
                (error) => {

                    console.error("Geolocation Error:", error);

                    let message = "Unable to get your current location.";

                    if (error.code === error.PERMISSION_DENIED) {
                        message =
                            "Location permission was denied. Please allow location access.";
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        message = "Your location could not be determined.";
                    } else if (error.code === error.TIMEOUT) {
                        message = "Location request timed out.";
                    }

                    alert(message);

                    locationBtn.innerHTML = originalText;
                    locationBtn.disabled = false;

                },

                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }

            );

        });

    }


    // =========================================================
    // ADD TO FAVORITES
    // =========================================================

    if (favBtn) {

        favBtn.addEventListener("click", () => {

            const city = cityName ? cityName.textContent.trim() : "";
            const country = countryName ? countryName.textContent.trim() : "";

            if (city === "" || city === "--") {
                alert("Please search for a city first.");
                return;
            }

            if (typeof saveFavorite === "function") {
                saveFavorite(city, country);
            } else {
                console.error("saveFavorite() function not found.");
            }

        });

    }


    // =========================================================
    // LOAD FAVORITES
    // =========================================================

    if (typeof loadFavorites === "function") {
        loadFavorites();
    } else {
        console.warn("loadFavorites() function not found.");
    }


    // =========================================================
    // LOAD SEARCH HISTORY
    // =========================================================

    if (typeof loadSearchHistory === "function") {
        loadSearchHistory();
    } else {
        console.warn("loadSearchHistory() function not found.");
    }


    // =========================================================
    // CLEAR SEARCH HISTORY
    // =========================================================

    if (clearHistoryBtn) {

        clearHistoryBtn.addEventListener("click", () => {

            if (typeof clearSearchHistory === "function") {

                clearSearchHistory();

            } else {

                console.warn("clearSearchHistory() function not found.");

                localStorage.removeItem("weatherSearchHistory");

                if (historyContainer) {
                    historyContainer.innerHTML = "";
                }

            }

        });

    }


    // =========================================================
    // INITIAL WEATHER
    // =========================================================
    // Load Pune when the website opens so the page is not empty.

    if (typeof getWeather === "function") {

        console.log("Loading default weather: Pune");

        getWeather("Pune");

    } else {

        console.error("getWeather() function not found.");

    }

});