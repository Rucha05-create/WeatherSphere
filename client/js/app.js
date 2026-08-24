// ============================================================
// APP.JS
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("WeatherSphere application started.");


    // =========================================================
    // CHECK IMPORTANT DOM ELEMENTS
    // =========================================================

    if (!cityInput) {
        console.error("cityInput not found.");
        return;
    }

    if (!searchBtn) {
        console.error("searchBtn not found.");
        return;
    }


    // =========================================================
    // SEARCH WEATHER
    // =========================================================

    searchBtn.addEventListener("click", () => {

        const city = cityInput.value.trim();

        if (city === "") {

            alert("Please enter a city name.");

            cityInput.focus();

            return;
        }

        getWeather(city);

    });


    // =========================================================
    // SEARCH USING ENTER KEY
    // =========================================================

    cityInput.addEventListener("keypress", (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            const city = cityInput.value.trim();

            if (city === "") {

                alert("Please enter a city name.");

                return;
            }

            getWeather(city);

        }

    });


    // =========================================================
    // CURRENT LOCATION
    // =========================================================

    const locationBtn =
        document.getElementById("locationBtn");


    if (locationBtn) {

        locationBtn.addEventListener("click", () => {

            // Check browser support
            if (!navigator.geolocation) {

                alert(
                    "Geolocation is not supported by your browser."
                );

                return;
            }


            // Change button text while locating
            const originalText =
                locationBtn.innerHTML;

            locationBtn.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Getting Location...';

            locationBtn.disabled = true;


            navigator.geolocation.getCurrentPosition(

                // =================================================
                // SUCCESS
                // =================================================

                (position) => {

                    const latitude =
                        position.coords.latitude;

                    const longitude =
                        position.coords.longitude;


                    console.log(
                        "Current Location:",
                        latitude,
                        longitude
                    );


                    getWeather(
                        `${latitude},${longitude}`
                    );


                    // Restore button
                    locationBtn.innerHTML =
                        originalText;

                    locationBtn.disabled = false;

                },


                // =================================================
                // ERROR
                // =================================================

                (error) => {

                    console.error(
                        "Geolocation Error:",
                        error
                    );


                    let message =
                        "Unable to get your current location.";


                    if (error.code === 1) {

                        message =
                            "Location permission was denied. Please allow location access.";

                    }

                    else if (error.code === 2) {

                        message =
                            "Your location could not be determined.";

                    }

                    else if (error.code === 3) {

                        message =
                            "Location request timed out.";

                    }


                    alert(message);


                    // Restore button
                    locationBtn.innerHTML =
                        originalText;

                    locationBtn.disabled = false;

                }

            );

        });

    }


    // =========================================================
    // ADD TO FAVORITES
    // =========================================================

    if (favBtn) {

        favBtn.addEventListener("click", () => {

            const city =
                cityName
                    ? cityName.textContent.trim()
                    : "";


            const country =
                countryName
                    ? countryName.textContent.trim()
                    : "";


            // Don't allow default/empty values
            if (
                city === "" ||
                city === "--" ||
                city === "Pune"
            ) {

                alert(
                    "Please search for a city first."
                );

                return;
            }


            // Check whether favourites function exists
            if (
                typeof saveFavorite === "function"
            ) {

                saveFavorite(
                    city,
                    country
                );

            }

            else {

                console.error(
                    "saveFavorite() function not found."
                );

            }

        });

    }


    // =========================================================
    // LOAD FAVORITES
    // =========================================================

    if (
        typeof loadFavorites === "function"
    ) {

        loadFavorites();

    }

    else {

        console.warn(
            "loadFavorites() function not found."
        );

    }


    // =========================================================
    // LOAD SEARCH HISTORY
    // =========================================================

    if (
        typeof loadSearchHistory === "function"
    ) {

        loadSearchHistory();

    }


    // =========================================================
    // CLEAR SEARCH HISTORY
    // =========================================================

    if (clearHistoryBtn) {

        clearHistoryBtn.addEventListener(
            "click",
            () => {

                if (
                    typeof clearSearchHistory ===
                    "function"
                ) {

                    clearSearchHistory();

                }

                else {

                    // Fallback
                    localStorage.removeItem(
                        "weatherSearchHistory"
                    );

                    if (historyContainer) {

                        historyContainer.innerHTML =
                            "";

                    }

                }

            }
        );

    }


    // =========================================================
    // INITIAL WEATHER
    // =========================================================

    /*
     * Load Pune automatically when the website opens.
     *
     * This is important because otherwise:
     *
     * - Hourly forecast is empty
     * - Weekly forecast is empty
     * - Weather map is empty
     * - Temperature chart is empty
     *
     * until the user searches for a city.
     */

    setTimeout(() => {

        if (
            typeof getWeather === "function"
        ) {

            console.log(
                "Loading default weather: Pune"
            );

            getWeather("Pune");

        }

        else {

            console.error(
                "getWeather() function not found."
            );

        }

    }, 300);


});