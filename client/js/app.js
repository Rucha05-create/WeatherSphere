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
    // AUTOCOMPLETE
    // =========================================================

    const suggestionsBox =
        document.getElementById("suggestions");

    let autocompleteTimer = null;


    // =========================================================
    // HIDE SUGGESTIONS
    // =========================================================

    function hideSuggestions() {

        if (!suggestionsBox) {
            return;
        }

        suggestionsBox.innerHTML = "";
        suggestionsBox.style.display = "none";

    }


    // =========================================================
    // ESCAPE HTML
    // =========================================================

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value || "";

        return div.innerHTML;

    }


    // =========================================================
    // SHOW AUTOCOMPLETE SUGGESTIONS
    // =========================================================

    function showSuggestions(locations) {

        if (!suggestionsBox) {
            return;
        }

        suggestionsBox.innerHTML = "";


        if (
            !Array.isArray(locations) ||
            locations.length === 0
        ) {

            hideSuggestions();

            return;

        }


        // Show maximum 10 results
        const limitedLocations =
            locations.slice(0, 10);


        limitedLocations.forEach(location => {

            const item =
                document.createElement("div");


            item.className =
                "suggestion";


            // =================================================
            // LOCATION INFORMATION
            // =================================================

            const name =
                location.name || "Unknown";

            const region =
                location.region || "";

            const country =
                location.country || "";

            const district =
                location.district || "";


            /*
             * WeatherAPI search results normally provide:
             *
             * name
             * region
             * country
             * lat
             * lon
             *
             * Some locations may also provide district-level
             * information.
             */


            let locationDetails = "";


            if (district) {

                locationDetails =
                    `${district}, ${region}, ${country}`;

            }

            else if (region) {

                locationDetails =
                    `${region}, ${country}`;

            }

            else {

                locationDetails =
                    country;

            }


            // Remove duplicate commas
            locationDetails =
                locationDetails
                    .replace(/,\s*,/g, ",")
                    .replace(/^,\s*/, "")
                    .replace(/,\s*$/, "");


            // =================================================
            // SUGGESTION HTML
            // =================================================

            item.innerHTML = `

                <div class="suggestion-title">

                    <i class="fa-solid fa-location-dot"></i>

                    <strong>
                        ${escapeHTML(name)}
                    </strong>

                </div>

                <div class="suggestion-location">

                    ${escapeHTML(locationDetails)}

                </div>

            `;


            // =================================================
            // CLICK SUGGESTION
            // =================================================

            item.addEventListener("click", () => {

                cityInput.value =
                    name;


                hideSuggestions();


                /*
                 * Use latitude and longitude when available.
                 * This makes locations with the same name
                 * much more accurate.
                 */

                if (
                    location.lat !== undefined &&
                    location.lon !== undefined
                ) {

                    getWeather(
                        `${location.lat},${location.lon}`
                    );

                }

                else {

                    getWeather(name);

                }

            });


            suggestionsBox.appendChild(item);

        });


        suggestionsBox.style.display =
            "block";

    }


    // =========================================================
    // GET LOCATION SUGGESTIONS
    // =========================================================

    async function getLocationSuggestions(query) {

        try {

            const response =
                await fetch(
                    `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`
                );


            if (!response.ok) {

                throw new Error(
                    `Autocomplete request failed: ${response.status}`
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

    }


    // =========================================================
    // USER TYPES IN SEARCH BOX
    // =========================================================

    cityInput.addEventListener(
        "input",
        () => {

            const query =
                cityInput.value.trim();


            clearTimeout(
                autocompleteTimer
            );


            // Hide dropdown when empty
            if (query.length === 0) {

                hideSuggestions();

                return;

            }


            /*
             * Wait 300ms before making API request.
             *
             * This prevents sending a request for every
             * single keyboard character.
             */

            autocompleteTimer =
                setTimeout(() => {

                    getLocationSuggestions(
                        query
                    );

                }, 300);

        }
    );


    // =========================================================
    // SEARCH BUTTON
    // =========================================================

    searchBtn.addEventListener(
        "click",
        () => {

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

        }
    );


    // =========================================================
    // ENTER KEY SEARCH
    // =========================================================

    cityInput.addEventListener(
        "keydown",
        (event) => {

            /*
             * If autocomplete suggestions are visible,
             * Enter should select the first suggestion.
             */

            if (
                event.key === "Enter" &&
                suggestionsBox &&
                suggestionsBox.style.display === "block"
            ) {

                const firstSuggestion =
                    suggestionsBox.querySelector(
                        ".suggestion"
                    );


                if (firstSuggestion) {

                    event.preventDefault();

                    firstSuggestion.click();

                    return;

                }

            }


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
    // CLOSE SUGGESTIONS WHEN CLICKING OUTSIDE
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
                if (
                    !navigator.geolocation
                ) {

                    alert(
                        "Geolocation is not supported by your browser."
                    );

                    return;

                }


                const originalText =
                    locationBtn.innerHTML;


                // Loading state
                locationBtn.innerHTML = `

                    <i class="fa-solid fa-spinner fa-spin"></i>

                    Getting Location...

                `;


                locationBtn.disabled =
                    true;


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


                        locationBtn.innerHTML =
                            originalText;


                        locationBtn.disabled =
                            false;

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


                        if (
                            error.code ===
                            error.PERMISSION_DENIED
                        ) {

                            message =
                                "Location permission was denied. Please allow location access.";

                        }

                        else if (
                            error.code ===
                            error.POSITION_UNAVAILABLE
                        ) {

                            message =
                                "Your location could not be determined.";

                        }

                        else if (
                            error.code ===
                            error.TIMEOUT
                        ) {

                            message =
                                "Location request timed out.";

                        }


                        alert(message);


                        locationBtn.innerHTML =
                            originalText;


                        locationBtn.disabled =
                            false;

                    },

                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
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
     *
     * This ensures that the page doesn't look empty
     * when the user opens it for the first time.
     */

    setTimeout(
        () => {

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

        },
        300
    );

});