// ============================================================
// WEATHERSPHERE - APP.JS
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("WeatherSphere application started.");

    // =========================================================
    // DOM ELEMENT CHECK
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
    // AUTOCOMPLETE ELEMENT
    // =========================================================

    const suggestions =
        document.getElementById("suggestions");


    // =========================================================
    // HIDE SUGGESTIONS
    // =========================================================

    function hideSuggestions() {

        if (suggestions) {

            suggestions.innerHTML = "";
            suggestions.style.display = "none";

        }

    }


    // =========================================================
    // SHOW SUGGESTIONS
    // =========================================================

    function showSuggestions(locations) {

        if (!suggestions) {
            return;
        }

        suggestions.innerHTML = "";


        if (!locations || locations.length === 0) {

            suggestions.style.display = "none";

            return;
        }


        // Maximum number of suggestions
        const limitedLocations =
            locations.slice(0, 10);


        limitedLocations.forEach(location => {

            const item =
                document.createElement("div");


            item.className = "suggestion";


            // Determine location type
            let locationType = "Location";


            if (
                location.region &&
                location.region !== location.name
            ) {

                locationType =
                    `${location.region}, ${location.country}`;

            }

            else {

                locationType =
                    location.country;

            }


            item.innerHTML = `

                <div class="suggestion-title">

                    <i class="fa-solid fa-location-dot"></i>

                    <strong>
                        ${location.name}
                    </strong>

                </div>

                <small>
                    ${locationType}
                </small>

            `;


            // =================================================
            // CLICK SUGGESTION
            // =================================================

            item.addEventListener("click", () => {

                cityInput.value =
                    location.name;

                hideSuggestions();

                getWeather(
                    `${location.lat},${location.lon}`
                );

            });


            suggestions.appendChild(item);

        });


        suggestions.style.display = "block";

    }


    // =========================================================
    // AUTOCOMPLETE SEARCH
    // =========================================================

    let autocompleteTimer;


    cityInput.addEventListener("input", () => {

        const query =
            cityInput.value.trim();


        // Clear previous timer
        clearTimeout(autocompleteTimer);


        // Hide if input is empty
        if (query.length === 0) {

            hideSuggestions();

            return;

        }


        /*
         * Wait for a short time before sending request.
         * This prevents an API request for every single
         * keyboard character.
         */

        autocompleteTimer =
            setTimeout(async () => {

                try {

                    const response =
                        await fetch(
                            `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`
                        );


                    if (!response.ok) {

                        throw new Error(
                            "Autocomplete request failed."
                        );

                    }


                    const locations =
                        await response.json();


                    showSuggestions(locations);

                }

                catch (error) {

                    console.error(
                        "Autocomplete Error:",
                        error
                    );

                    hideSuggestions();

                }

            }, 300);

    });


    // =========================================================
    // SEARCH WEATHER
    // =========================================================

    searchBtn.addEventListener("click", () => {

        const city =
            cityInput.value.trim();


        if (city === "") {

            alert(
                "Please enter a city name."
            );

            cityInput.focus();

            return;

        }


        hideSuggestions();

        getWeather(city);

    });


    // =========================================================
    // SEARCH USING ENTER KEY
    // =========================================================

    cityInput.addEventListener(
        "keypress",
        (event) => {

            if (event.key === "Enter") {

                event.preventDefault();


                const city =
                    cityInput.value.trim();


                if (city === "") {

                    alert(
                        "Please enter a city name."
                    );

                    return;

                }


                hideSuggestions();

                getWeather(city);

            }

        }
    );


    // =========================================================
    // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    // =========================================================

    document.addEventListener(
        "click",
        (event) => {

            if (
                !event.target.closest(".search-box")
            ) {

                hideSuggestions();

            }

        }
    );


    // =========================================================
    // CURRENT LOCATION
    // =========================================================

    const locationBtn =
        document.getElementById(
            "locationBtn"
        );


    if (locationBtn) {

        locationBtn.addEventListener(
            "click",
            () => {

                hideSuggestions();


                // Check browser support
                if (!navigator.geolocation) {

                    alert(
                        "Geolocation is not supported by your browser."
                    );

                    return;

                }


                const originalText =
                    locationBtn.innerHTML;


                locationBtn.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Getting Location...
                `;


                locationBtn.disabled = true;


                navigator.geolocation.getCurrentPosition(

                    // =========================================
                    // SUCCESS
                    // =========================================

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


                        locationBtn.innerHTML =
                            originalText;


                        locationBtn.disabled =
                            false;

                    },


                    // =========================================
                    // ERROR
                    // =========================================

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


                        locationBtn.innerHTML =
                            originalText;


                        locationBtn.disabled =
                            false;

                    }

                );

            }
        );

    }


    // =========================================================
    // ADD TO FAVORITES
    // =========================================================

    if (favBtn) {

        favBtn.addEventListener(
            "click",
            () => {

                const city =
                    cityName
                        ? cityName.textContent.trim()
                        : "";


                const country =
                    countryName
                        ? countryName.textContent.trim()
                        : "";


                // Check for empty/default value
                if (
                    city === "" ||
                    city === "--"
                ) {

                    alert(
                        "Please search for a city first."
                    );

                    return;

                }


                if (
                    typeof saveFavorite ===
                    "function"
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

            }
        );

    }


    // =========================================================
    // LOAD FAVORITES
    // =========================================================

    if (
        typeof loadFavorites ===
        "function"
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
        typeof loadSearchHistory ===
        "function"
    ) {

        loadSearchHistory();

    }

    else {

        console.warn(
            "loadSearchHistory() function not found."
        );

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
     */

    setTimeout(() => {

        if (
            typeof getWeather ===
            "function"
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