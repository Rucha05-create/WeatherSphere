// ============================================================
// WEATHERSPHERE - AUTOCOMPLETE.JS
// ============================================================
// Handles:
// 1. Live location suggestions while typing
// 2. City / village / district / state / country display
// 3. Debounced search requests
// 4. Backend API support
// 5. WeatherAPI fallback
// 6. Keyboard navigation
// 7. Mouse selection
// 8. Exact latitude/longitude search
// 9. Safe HTML rendering
// 10. Closing dropdown when clicking outside
// 11. Request cancellation to prevent stale results
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
    // CHECK REQUIRED ELEMENTS
    // =========================================================

    if (!input) {

        console.error(
            "WeatherSphere Autocomplete: cityInput not found."
        );

        return;
    }


    if (!suggestionsBox) {

        console.error(
            "WeatherSphere Autocomplete: suggestions container not found."
        );

        return;
    }


    // =========================================================
    // VARIABLES
    // =========================================================

    let debounceTimer = null;

    let selectedIndex = -1;

    let currentLocations = [];

    let abortController = null;

    let requestId = 0;


    // =========================================================
    // BACKEND URL
    // =========================================================

    const BACKEND_URL =
        "http://localhost:5000";


    // =========================================================
    // HIDE SUGGESTIONS
    // =========================================================

    function hideSuggestions() {

        suggestionsBox.innerHTML = "";

        suggestionsBox.style.display = "none";

        suggestionsBox.classList.remove("show");

        selectedIndex = -1;

        currentLocations = [];

    }


    // =========================================================
    // SHOW SUGGESTIONS
    // =========================================================

    function displaySuggestions() {

        suggestionsBox.style.display = "block";

        suggestionsBox.classList.add("show");

    }


    // =========================================================
    // ESCAPE HTML
    // =========================================================
    // Prevents API data from being inserted as HTML.
    // =========================================================

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value ?? "";

        return div.innerHTML;

    }


    // =========================================================
    // NORMALIZE LOCATION
    // =========================================================
    // Makes different API response formats consistent.
    // =========================================================

    function normalizeLocation(location) {

        if (!location) {
            return null;
        }


        return {

            name:
                location.name ||
                location.city ||
                "Unknown Location",


            district:
                location.district ||
                location.county ||
                "",


            region:
                location.region ||
                location.state ||
                location.state_district ||
                "",


            country:
                location.country ||
                "",


            lat:
                location.lat ??
                location.latitude ??
                null,


            lon:
                location.lon ??
                location.lng ??
                location.longitude ??
                null

        };

    }


    // =========================================================
    // CREATE LOCATION INFORMATION
    // =========================================================

    function getLocationDetails(location) {

        const details =
            normalizeLocation(location);


        if (!details) {

            return {

                name: "Unknown Location",

                district: "",

                region: "",

                country: "",

                lat: null,

                lon: null,

                locationText: ""

            };

        }


        const parts = [];


        // -----------------------------------------------------
        // District
        // -----------------------------------------------------

        if (details.district) {

            parts.push(
                details.district
            );

        }


        // -----------------------------------------------------
        // Region / State
        // -----------------------------------------------------

        if (
            details.region &&
            details.region !== details.district
        ) {

            parts.push(
                details.region
            );

        }


        // -----------------------------------------------------
        // Country
        // -----------------------------------------------------

        if (details.country) {

            parts.push(
                details.country
            );

        }


        return {

            ...details,

            locationText:
                parts.join(", ")

        };

    }


    // =========================================================
    // SHOW SUGGESTIONS
    // =========================================================

    function showSuggestions(locations) {

        suggestionsBox.innerHTML = "";

        selectedIndex = -1;


        if (
            !Array.isArray(locations) ||
            locations.length === 0
        ) {

            hideSuggestions();

            return;

        }


        // -----------------------------------------------------
        // Limit results to 10
        // -----------------------------------------------------

        const limitedLocations =
            locations
                .slice(0, 10)
                .map(normalizeLocation)
                .filter(Boolean);


        // IMPORTANT:
        // Keep currentLocations synchronized with what is
        // actually displayed.
        currentLocations =
            limitedLocations;


        if (currentLocations.length === 0) {

            hideSuggestions();

            return;

        }


        // =====================================================
        // CREATE EACH SUGGESTION
        // =====================================================

        currentLocations.forEach(
            (location, index) => {

                const item =
                    document.createElement("div");


                item.className =
                    "suggestion";


                item.setAttribute(
                    "role",
                    "option"
                );


                item.setAttribute(
                    "data-index",
                    index
                );


                item.setAttribute(
                    "aria-selected",
                    "false"
                );


                // ------------------------------------------------
                // LOCATION DETAILS
                // ------------------------------------------------

                const details =
                    getLocationDetails(location);


                // ------------------------------------------------
                // TITLE
                // ------------------------------------------------

                const title =
                    document.createElement("div");


                title.className =
                    "suggestion-title";


                // Location icon

                const icon =
                    document.createElement("i");


                icon.className =
                    "fa-solid fa-location-dot";


                // City name

                const strong =
                    document.createElement("strong");


                strong.textContent =
                    details.name;


                title.appendChild(icon);

                title.appendChild(strong);


                // ------------------------------------------------
                // LOCATION INFORMATION
                // ------------------------------------------------

                const locationInfo =
                    document.createElement("div");


                locationInfo.className =
                    "suggestion-location";


                const locationParts = [];


                if (details.district) {

                    locationParts.push(
                        details.district
                    );

                }


                if (
                    details.region &&
                    details.region !== details.district
                ) {

                    locationParts.push(
                        details.region
                    );

                }


                if (details.country) {

                    locationParts.push(
                        details.country
                    );

                }


                locationInfo.textContent =
                    locationParts.join(" • ");


                // ------------------------------------------------
                // ADD TO ITEM
                // ------------------------------------------------

                item.appendChild(title);


                if (locationParts.length > 0) {

                    item.appendChild(
                        locationInfo
                    );

                }


                // =================================================
                // MOUSE ENTER
                // =================================================

                item.addEventListener(
                    "mouseenter",
                    () => {

                        selectedIndex =
                            index;

                        updateSelectedItem();

                    }
                );


                // =================================================
                // CLICK
                // =================================================

                item.addEventListener(
                    "mousedown",
                    (event) => {

                        /*
                         * Prevent blur event from hiding the
                         * dropdown before the click happens.
                         */

                        event.preventDefault();

                    }
                );


                item.addEventListener(
                    "click",
                    () => {

                        selectLocation(
                            location
                        );

                    }
                );


                suggestionsBox.appendChild(
                    item
                );

            }
        );


        // -----------------------------------------------------
        // Show dropdown
        // -----------------------------------------------------

        displaySuggestions();

    }


    // =========================================================
    // SELECT LOCATION
    // =========================================================

    function selectLocation(location) {

        if (!location) {
            return;
        }


        const details =
            getLocationDetails(location);


        // -----------------------------------------------------
        // Set input value
        // -----------------------------------------------------

        input.value =
            details.name;


        // -----------------------------------------------------
        // Close dropdown
        // -----------------------------------------------------

        hideSuggestions();


        // -----------------------------------------------------
        // Build search query
        // -----------------------------------------------------

        let searchQuery;


        // =====================================================
        // EXACT COORDINATES
        // =====================================================

        if (
            details.lat !== null &&
            details.lat !== undefined &&
            details.lon !== null &&
            details.lon !== undefined
        ) {

            searchQuery =
                `${details.lat},${details.lon}`;

        }


        // =====================================================
        // FALLBACK LOCATION QUERY
        // =====================================================

        else {

            searchQuery = [

                details.name,

                details.district,

                details.region,

                details.country

            ]
                .filter(Boolean)
                .join(", ");

        }


        // -----------------------------------------------------
        // Search selected location
        // -----------------------------------------------------

        if (
            typeof getWeather ===
            "function"
        ) {

            getWeather(
                searchQuery
            );

        }

        else {

            console.error(
                "Autocomplete: getWeather() is not available."
            );

        }

    }


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

                const isSelected =
                    index === selectedIndex;


                item.classList.toggle(
                    "suggestion-selected",
                    isSelected
                );


                item.setAttribute(
                    "aria-selected",
                    isSelected
                        ? "true"
                        : "false"
                );

            }
        );


        // -----------------------------------------------------
        // Scroll selected suggestion into view
        // -----------------------------------------------------

        if (
            selectedIndex >= 0 &&
            items[selectedIndex]
        ) {

            items[selectedIndex]
                .scrollIntoView({
                    block: "nearest"
                });

        }

    }


    // =========================================================
    // FETCH SUGGESTIONS FROM BACKEND
    // =========================================================

    async function getBackendSuggestions(
        query,
        signal
    ) {

        /*
         * Expected backend route:
         *
         * GET /api/search/:query
         *
         * Example:
         *
         * /api/search/Pune
         */

        const url =
            `${BACKEND_URL}/api/search/${encodeURIComponent(query)}`;


        const response =
            await fetch(
                url,
                {
                    method: "GET",
                    signal
                }
            );


        if (!response.ok) {

            throw new Error(
                `Backend search HTTP error: ${response.status}`
            );

        }


        const data =
            await response.json();


        // -----------------------------------------------------
        // Support multiple backend response formats
        // -----------------------------------------------------

        if (Array.isArray(data)) {

            return data;

        }


        if (
            data &&
            Array.isArray(data.results)
        ) {

            return data.results;

        }


        if (
            data &&
            Array.isArray(data.locations)
        ) {

            return data.locations;

        }


        if (
            data &&
            Array.isArray(data.data)
        ) {

            return data.data;

        }


        return [];

    }


    // =========================================================
    // FETCH SUGGESTIONS FROM WEATHERAPI
    // =========================================================

    async function getWeatherAPISuggestions(
        query,
        signal
    ) {

        // -----------------------------------------------------
        // Check API key
        // -----------------------------------------------------

        if (
            typeof API_KEY ===
            "undefined" ||
            !API_KEY
        ) {

            throw new Error(
                "WeatherAPI key is missing."
            );

        }


        const url =
            `https://api.weatherapi.com/v1/search.json?key=${encodeURIComponent(API_KEY)}&q=${encodeURIComponent(query)}`;


        const response =
            await fetch(
                url,
                {
                    method: "GET",
                    signal
                }
            );


        if (!response.ok) {

            throw new Error(
                `WeatherAPI search HTTP error: ${response.status}`
            );

        }


        const data =
            await response.json();


        if (!Array.isArray(data)) {

            return [];

        }


        return data;

    }


    // =========================================================
    // GET LOCATION SUGGESTIONS
    // =========================================================

    async function getSuggestions(query) {

        const currentRequest =
            ++requestId;


        // -----------------------------------------------------
        // Cancel previous request
        // -----------------------------------------------------

        if (abortController) {

            abortController.abort();

        }


        abortController =
            new AbortController();


        const signal =
            abortController.signal;


        try {

            let locations = [];


            // =================================================
            // TRY BACKEND FIRST
            // =================================================

            try {

                locations =
                    await getBackendSuggestions(
                        query,
                        signal
                    );


            }

            catch (backendError) {

                // Ignore cancellation

                if (
                    backendError.name ===
                    "AbortError"
                ) {

                    return;

                }


                console.warn(
                    "Backend autocomplete unavailable. Trying WeatherAPI...",
                    backendError.message
                );


                // =============================================
                // FALLBACK TO WEATHERAPI
                // =============================================

                locations =
                    await getWeatherAPISuggestions(
                        query,
                        signal
                    );

            }


            // =================================================
            // MAKE SURE THIS IS STILL THE LATEST REQUEST
            // =================================================

            if (
                currentRequest !== requestId
            ) {

                return;

            }


            // -------------------------------------------------
            // Make sure input hasn't changed
            // -------------------------------------------------

            if (
                input.value.trim() !== query
            ) {

                return;

            }


            // =================================================
            // DISPLAY RESULTS
            // =================================================

            showSuggestions(
                locations
            );

        }

        catch (error) {

            if (
                error.name ===
                "AbortError"
            ) {

                return;

            }


            console.error(
                "Autocomplete error:",
                error
            );


            hideSuggestions();

        }

    }


    // =========================================================
    // INPUT EVENT
    // =========================================================

    input.addEventListener(
        "input",
        () => {

            const query =
                input.value.trim();


            // -------------------------------------------------
            // Cancel old debounce
            // -------------------------------------------------

            clearTimeout(
                debounceTimer
            );


            // -------------------------------------------------
            // Reset keyboard navigation
            // -------------------------------------------------

            selectedIndex = -1;


            // =================================================
            // EMPTY INPUT
            // =================================================

            if (
                query.length === 0
            ) {

                hideSuggestions();

                return;

            }


            // =================================================
            // MINIMUM CHARACTERS
            // =================================================

            if (
                query.length < 2
            ) {

                hideSuggestions();

                return;

            }


            // =================================================
            // DEBOUNCE
            // =================================================

            debounceTimer =
                setTimeout(
                    () => {

                        getSuggestions(
                            query
                        );

                    },
                    350
                );

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


            const dropdownVisible =
                suggestionsBox.style.display !==
                "none";


            // -------------------------------------------------
            // No suggestions
            // -------------------------------------------------

            if (
                !items.length ||
                !dropdownVisible
            ) {

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
                    selectedIndex < items.length
                ) {

                    event.preventDefault();


                    const location =
                        currentLocations[
                            selectedIndex
                        ];


                    selectLocation(
                        location
                    );

                }

            }


            // =================================================
            // ESCAPE
            // =================================================

            else if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                hideSuggestions();

            }

        }
    );


    // =========================================================
    // CLOSE WHEN CLICKING OUTSIDE
    // =========================================================

    document.addEventListener(
        "click",
        (event) => {

            const searchBox =
                event.target.closest(
                    ".search-box"
                );


            if (!searchBox) {

                hideSuggestions();

            }

        }
    );


    // =========================================================
    // INPUT BLUR
    // =========================================================

    input.addEventListener(
        "blur",
        () => {

            /*
             * Delay allows the suggestion click event to
             * execute before the dropdown disappears.
             */

            setTimeout(
                () => {

                    if (
                        !suggestionsBox.matches(
                            ":hover"
                        ) &&
                        document.activeElement !==
                        input
                    ) {

                        hideSuggestions();

                    }

                },
                200
            );

        }
    );


    // =========================================================
    // PUBLIC FUNCTION
    // =========================================================

    /*
     * Allows app.js or other files to close the dropdown.
     */

    window.hideWeatherSuggestions =
        hideSuggestions;


    // =========================================================
    // PUBLIC SEARCH FUNCTION
    // =========================================================

    /*
     * Useful if another JavaScript file wants to manually
     * trigger autocomplete.
     */

    window.refreshWeatherSuggestions =
        function () {

            const query =
                input.value.trim();


            if (
                query.length >= 2
            ) {

                getSuggestions(
                    query
                );

            }

        };


    // =========================================================
    // INITIALIZATION MESSAGE
    // =========================================================

    console.log(
        "WeatherSphere - Autocomplete initialized successfully."
    );

});