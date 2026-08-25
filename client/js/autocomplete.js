// ============================================================
// WEATHERSPHERE
// AUTOCOMPLETE / CITY SEARCH SUGGESTIONS
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // DOM ELEMENTS
    // =========================================================

    const input =
        document.getElementById("cityInput");

    const suggestionsBox =
        document.getElementById("suggestions");


    // =========================================================
    // SAFETY CHECK
    // =========================================================

    if (!input || !suggestionsBox) {

        console.error(
            "Autocomplete elements not found."
        );

        return;

    }


    // =========================================================
    // VARIABLES
    // =========================================================

    let debounceTimer = null;

    let selectedIndex = -1;

    let currentResults = [];


    // =========================================================
    // WHEN USER TYPES
    // =========================================================

    input.addEventListener("input", () => {

        const query =
            input.value.trim();


        // Reset selected item
        selectedIndex = -1;


        // Cancel previous request timer
        clearTimeout(debounceTimer);


        // Hide dropdown if empty
        if (query.length === 0) {

            hideSuggestions();

            return;

        }


        /*
         * Start searching after 300ms.
         *
         * This prevents sending an API request
         * for every single keyboard character.
         */

        debounceTimer =
            setTimeout(() => {

                getSuggestions(query);

            }, 300);

    });


    // =========================================================
    // GET CITY SUGGESTIONS
    // =========================================================

    async function getSuggestions(query) {

        try {

            // =================================================
            // WEATHER API SEARCH
            // =================================================

            const url =
                `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`;


            const response =
                await fetch(url);


            if (!response.ok) {

                throw new Error(
                    `WeatherAPI Error: ${response.status}`
                );

            }


            const results =
                await response.json();


            // =================================================
            // CHECK RESULTS
            // =================================================

            if (
                !Array.isArray(results) ||
                results.length === 0
            ) {

                hideSuggestions();

                return;

            }


            /*
             * Store current results.
             * Maximum 10 results are shown.
             */

            currentResults =
                results.slice(0, 10);


            // =================================================
            // DISPLAY RESULTS
            // =================================================

            await displaySuggestions(
                currentResults
            );

        }

        catch (error) {

            console.error(
                "Autocomplete error:",
                error
            );


            hideSuggestions();

        }

    }


    // =========================================================
    // DISPLAY SUGGESTIONS
    // =========================================================

    async function displaySuggestions(results) {

        // Clear previous results
        suggestionsBox.innerHTML = "";


        if (!results.length) {

            hideSuggestions();

            return;

        }


        // Show loading message
        suggestionsBox.innerHTML = `

            <div class="suggestion-loading">

                <i class="fa-solid fa-spinner fa-spin"></i>

                Finding locations...

            </div>

        `;


        suggestionsBox.style.display =
            "block";


        // =====================================================
        // GET DISTRICT INFORMATION
        // =====================================================

        const enrichedResults =
            await Promise.all(

                results.map(async (place) => {

                    const district =
                        await getDistrict(
                            place.lat,
                            place.lon
                        );


                    return {
                        ...place,
                        district: district
                    };

                })

            );


        // =====================================================
        // CLEAR LOADING MESSAGE
        // =====================================================

        suggestionsBox.innerHTML = "";


        // =====================================================
        // CREATE EACH SUGGESTION
        // =====================================================

        enrichedResults.forEach(
            (place, index) => {

                const suggestion =
                    document.createElement("div");


                suggestion.className =
                    "suggestion";


                suggestion.dataset.index =
                    index;


                // =================================================
                // LOCATION INFORMATION
                // =================================================

                const name =
                    place.name || "Unknown Location";


                const region =
                    place.region || "";


                const country =
                    place.country || "";


                const district =
                    place.district || "";


                // =================================================
                // BUILD LOCATION TEXT
                // =================================================

                let locationParts = [];


                /*
                 * District
                 */

                if (district) {

                    locationParts.push(
                        `${district} District`
                    );

                }


                /*
                 * State / Region
                 */

                if (region) {

                    locationParts.push(
                        region
                    );

                }


                /*
                 * Country
                 */

                if (country) {

                    locationParts.push(
                        country
                    );

                }


                const locationText =
                    locationParts.join(
                        ", "
                    );


                // =================================================
                // CREATE HTML
                // =================================================

                suggestion.innerHTML = `

                    <div class="suggestion-main">

                        <i class="fa-solid fa-location-dot"></i>

                        <strong>
                            ${escapeHTML(name)}
                        </strong>

                    </div>


                    <div class="suggestion-location">

                        ${
                            locationText
                                ? escapeHTML(locationText)
                                : "Location"
                        }

                    </div>

                `;


                // =================================================
                // CLICK EVENT
                // =================================================

                suggestion.addEventListener(
                    "click",
                    () => {

                        selectLocation(
                            place
                        );

                    }
                );


                // =================================================
                // MOUSE ENTER
                // =================================================

                suggestion.addEventListener(
                    "mouseenter",
                    () => {

                        selectedIndex =
                            index;


                        updateSelectedItem();

                    }
                );


                suggestionsBox.appendChild(
                    suggestion
                );

            }
        );


        // =====================================================
        // SHOW DROPDOWN
        // =====================================================

        suggestionsBox.style.display =
            "block";


        // Reset keyboard selection
        selectedIndex = -1;

    }


    // =========================================================
    // GET DISTRICT USING OPENSTREETMAP
    // =========================================================

    async function getDistrict(
        latitude,
        longitude
    ) {

        try {

            if (
                latitude === undefined ||
                longitude === undefined
            ) {

                return "";

            }


            const url =
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;


            const response =
                await fetch(
                    url,
                    {
                        headers: {
                            "Accept":
                                "application/json"
                        }
                    }
                );


            if (!response.ok) {

                return "";

            }


            const data =
                await response.json();


            if (
                !data ||
                !data.address
            ) {

                return "";

            }


            const address =
                data.address;


            /*
             * Nominatim may use different fields
             * depending on the location.
             *
             * district may appear as:
             *
             * county
             * district
             * state_district
             * municipality
             */

            const district =
                address.county ||
                address.district ||
                address.state_district ||
                address.municipality ||
                "";


            return cleanDistrictName(
                district
            );

        }

        catch (error) {

            console.warn(
                "District lookup failed:",
                error
            );


            return "";

        }

    }


    // =========================================================
    // CLEAN DISTRICT NAME
    // =========================================================

    function cleanDistrictName(
        district
    ) {

        if (!district) {

            return "";

        }


        let cleaned =
            district.trim();


        /*
         * Avoid duplicate "District".
         */

        cleaned =
            cleaned.replace(
                /\s+District$/i,
                ""
            );


        /*
         * Avoid common administrative
         * suffixes when possible.
         */

        cleaned =
            cleaned.replace(
                /\s+district$/i,
                ""
            );


        return cleaned;

    }


    // =========================================================
    // SELECT LOCATION
    // =========================================================

    function selectLocation(
        place
    ) {

        // =====================================================
        // PUT LOCATION NAME INTO SEARCH BOX
        // =====================================================

        input.value =
            place.name;


        // =====================================================
        // HIDE DROPDOWN
        // =====================================================

        hideSuggestions();


        selectedIndex = -1;


        // =====================================================
        // SEARCH WEATHER
        // =====================================================

        if (
            typeof getWeather ===
            "function"
        ) {

            /*
             * Use latitude + longitude.
             *
             * This is more accurate than searching
             * only by the city name.
             */

            if (
                place.lat !== undefined &&
                place.lon !== undefined
            ) {

                getWeather(
                    `${place.lat},${place.lon}`
                );

            }

            else {

                getWeather(
                    place.name
                );

            }

        }

        else {

            console.error(
                "getWeather() function not found."
            );

        }

    }


    // =========================================================
    // HIDE SUGGESTIONS
    // =========================================================

    function hideSuggestions() {

        suggestionsBox.innerHTML = "";

        suggestionsBox.style.display =
            "none";


        selectedIndex = -1;

        currentResults = [];

    }


    // =========================================================
    // CLOSE WHEN CLICKING OUTSIDE
    // =========================================================

    document.addEventListener(
        "click",
        (event) => {

            if (
                !input.contains(event.target) &&
                !suggestionsBox.contains(event.target)
            ) {

                hideSuggestions();

            }

        }
    );


    // =========================================================
    // KEYBOARD NAVIGATION
    // =========================================================

    input.addEventListener(
        "keydown",
        (event) => {

            const items =
                suggestionsBox.querySelectorAll(
                    ".suggestion"
                );


            if (!items.length) {

                return;

            }


            // =================================================
            // ARROW DOWN
            // =================================================

            if (
                event.key === "ArrowDown"
            ) {

                event.preventDefault();


                selectedIndex++;


                if (
                    selectedIndex >=
                    items.length
                ) {

                    selectedIndex = 0;

                }


                updateSelectedItem();

            }


            // =================================================
            // ARROW UP
            // =================================================

            else if (
                event.key === "ArrowUp"
            ) {

                event.preventDefault();


                selectedIndex--;


                if (
                    selectedIndex < 0
                ) {

                    selectedIndex =
                        items.length - 1;

                }


                updateSelectedItem();

            }


            // =================================================
            // ENTER
            // =================================================

            else if (
                event.key === "Enter"
            ) {

                if (
                    selectedIndex >= 0 &&
                    selectedIndex < currentResults.length
                ) {

                    event.preventDefault();


                    selectLocation(
                        currentResults[
                            selectedIndex
                        ]
                    );

                }

            }


            // =================================================
            // ESCAPE
            // =================================================

            else if (
                event.key === "Escape"
            ) {

                hideSuggestions();

            }

        }
    );


    // =========================================================
    // UPDATE SELECTED ITEM
    // =========================================================

    function updateSelectedItem() {

        const items =
            suggestionsBox.querySelectorAll(
                ".suggestion"
            );


        items.forEach(
            (item, index) => {

                item.classList.remove(
                    "suggestion-selected"
                );


                if (
                    index === selectedIndex
                ) {

                    item.classList.add(
                        "suggestion-selected"
                    );


                    /*
                     * Keep selected result visible
                     * when navigating with keyboard.
                     */

                    item.scrollIntoView({
                        block: "nearest"
                    });

                }

            }
        );

    }


    // =========================================================
    // ESCAPE HTML
    // =========================================================

    function escapeHTML(
        value
    ) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            value || "";


        return div.innerHTML;

    }

});