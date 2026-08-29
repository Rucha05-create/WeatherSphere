// ============================================================
// WEATHERSPHERE - AUTOCOMPLETE.JS
// ============================================================
// Handles:
// 1. Live location suggestions
// 2. City / village / district / state / country display
// 3. Debounced backend requests
// 4. WeatherAPI fallback
// 5. Keyboard navigation
// 6. Mouse selection
// 7. Exact latitude/longitude search
// 8. Location disambiguation
// 9. Safe HTML rendering
// 10. Closing dropdown
// 11. Request cancellation
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
    // Converts backend / WeatherAPI responses into one format.
    // =========================================================

    function normalizeLocation(location) {

        if (!location) {

            return null;

        }


        const latitude =
            location.lat ??
            location.latitude ??
            null;


        const longitude =
            location.lon ??
            location.lng ??
            location.longitude ??
            null;


        return {

            name:
                location.name ||
                location.city ||
                "Unknown Location",


            district:
                location.district ||
                location.county ||
                location.district_name ||
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
                latitude !== null
                    ? Number(latitude)
                    : null,


            lon:
                longitude !== null
                    ? Number(longitude)
                    : null

        };

    }


    // =========================================================
    // CREATE LOCATION DETAILS
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
        // DISTRICT
        // -----------------------------------------------------

        if (details.district) {

            parts.push(
                details.district
            );

        }


        // -----------------------------------------------------
        // STATE / REGION
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
        // COUNTRY
        // -----------------------------------------------------

        if (details.country) {

            parts.push(
                details.country
            );

        }


        return {

            ...details,

            locationText:
                parts.join(" • ")

        };

    }


    // =========================================================
    // BUILD LOCATION QUERY
    // =========================================================
    // Used only when coordinates are unavailable.
    // =========================================================

    function buildLocationQuery(details) {

        return [

            details.name,

            details.district,

            details.region,

            details.country

        ]
            .filter(Boolean)
            .join(", ");

    }


    // =========================================================
    // CHECK VALID COORDINATES
    // =========================================================

    function hasCoordinates(location) {

        return (

            location &&

            Number.isFinite(
                Number(location.lat)
            ) &&

            Number.isFinite(
                Number(location.lon)
            )

        );

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
        // Normalize and limit results
        // -----------------------------------------------------

        const limitedLocations =
            locations
                .slice(0, 10)
                .map(normalizeLocation)
                .filter(Boolean);


        currentLocations =
            limitedLocations;


        if (
            currentLocations.length === 0
        ) {

            hideSuggestions();

            return;

        }


        // =====================================================
        // CREATE SUGGESTION CARDS
        // =====================================================

        currentLocations.forEach(
            (location, index) => {

                const details =
                    getLocationDetails(location);


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


                // =================================================
                // TITLE
                // =================================================

                const title =
                    document.createElement("div");


                title.className =
                    "suggestion-title";


                const icon =
                    document.createElement("i");


                icon.className =
                    "fa-solid fa-location-dot";


                const strong =
                    document.createElement("strong");


                strong.textContent =
                    details.name;


                title.appendChild(icon);

                title.appendChild(strong);


                // =================================================
                // LOCATION INFORMATION
                // =================================================

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


                // =================================================
                // COORDINATES
                // =================================================
                // This is especially useful when two locations
                // have similar or identical names.
                // =================================================

                const coordinates =
                    document.createElement("small");


                coordinates.className =
                    "suggestion-coordinates";


                if (hasCoordinates(location)) {

                    coordinates.textContent =
                        `📍 ${Number(location.lat).toFixed(4)}, ` +
                        `${Number(location.lon).toFixed(4)}`;

                }

                else {

                    coordinates.textContent =
                        "📍 Coordinates unavailable";

                }


                // =================================================
                // APPEND CONTENT
                // =================================================

                item.appendChild(title);


                if (
                    locationParts.length > 0
                ) {

                    item.appendChild(
                        locationInfo
                    );

                }


                item.appendChild(
                    coordinates
                );


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
                // PREVENT BLUR
                // =================================================

                item.addEventListener(
                    "mousedown",
                    (event) => {

                        event.preventDefault();

                    }
                );


                // =================================================
                // CLICK
                // =================================================

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


        // =====================================================
        // DISPLAY DROPDOWN
        // =====================================================

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


        // =====================================================
        // SET INPUT
        // =====================================================

        input.value =
            details.name;


        // =====================================================
        // CLOSE DROPDOWN
        // =====================================================

        hideSuggestions();


        // =====================================================
        // EXACT COORDINATE SEARCH
        // =====================================================
        // IMPORTANT:
        //
        // We do NOT search only by city name.
        //
        // If there are two similar locations such as:
        //
        // Jalgaon
        // Jalgaon Jamod
        //
        // or two locations with the same name,
        // latitude + longitude identify the exact place.
        // =====================================================

        if (
            hasCoordinates(details)
        ) {

            const coordinates =
                `${details.lat},${details.lon}`;


            console.log(
                "WeatherSphere - Selected exact location:",
                details.name
            );


            console.log(
                "WeatherSphere - Coordinates:",
                coordinates
            );


            if (
                typeof getWeather ===
                "function"
            ) {

                getWeather(
                    coordinates
                );

            }

            else {

                console.error(
                    "Autocomplete: getWeather() is not available."
                );

            }


            return;

        }


        // =====================================================
        // FALLBACK LOCATION SEARCH
        // =====================================================

        const searchQuery =
            buildLocationQuery(details);


        console.log(
            "WeatherSphere - Coordinate unavailable."
        );


        console.log(
            "WeatherSphere - Using location query:",
            searchQuery
        );


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
        // Keep selected item visible
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

        // IMPORTANT:
        //
        // encodeURIComponent() converts:
        //
        // "New Delhi"
        //
        // into:
        //
        // "New%20Delhi"
        //
        // so spaces and special characters are safely
        // passed through the URL.
        //

        const encodedQuery =
            encodeURIComponent(
                query
            );


        const url =
            `${BACKEND_URL}/api/search/${encodedQuery}`;


        console.log(
            "WeatherSphere - Backend search:",
            query
        );


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
        // Support different backend response formats
        // -----------------------------------------------------

        if (
            Array.isArray(data)
        ) {

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
    // WEATHERAPI FALLBACK
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
            `https://api.weatherapi.com/v1/search.json` +
            `?key=${encodeURIComponent(API_KEY)}` +
            `&q=${encodeURIComponent(query)}`;


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


        if (
            !Array.isArray(data)
        ) {

            return [];

        }


        return data;

    }


    // =========================================================
    // GET SUGGESTIONS
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
            // BACKEND FIRST
            // =================================================

            try {

                locations =
                    await getBackendSuggestions(
                        query,
                        signal
                    );

            }

            catch (backendError) {

                if (
                    backendError.name ===
                    "AbortError"
                ) {

                    return;

                }


                console.warn(
                    "WeatherSphere - Backend autocomplete unavailable. Using WeatherAPI fallback.",
                    backendError.message
                );


                // =============================================
                // WEATHERAPI FALLBACK
                // =============================================

                locations =
                    await getWeatherAPISuggestions(
                        query,
                        signal
                    );

            }


            // =================================================
            // CHECK REQUEST ID
            // =================================================

            if (
                currentRequest !==
                requestId
            ) {

                return;

            }


            // =================================================
            // CHECK INPUT
            // =================================================

            if (
                input.value.trim() !==
                query
            ) {

                return;

            }


            // =================================================
            // DISPLAY
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
                "WeatherSphere Autocomplete Error:",
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
            // Cancel debounce
            // -------------------------------------------------

            clearTimeout(
                debounceTimer
            );


            // -------------------------------------------------
            // Reset selection
            // -------------------------------------------------

            selectedIndex = -1;


            // -------------------------------------------------
            // Empty input
            // -------------------------------------------------

            if (
                query.length === 0
            ) {

                hideSuggestions();

                return;

            }


            // -------------------------------------------------
            // Minimum 2 characters
            // -------------------------------------------------

            if (
                query.length < 2
            ) {

                hideSuggestions();

                return;

            }


            // -------------------------------------------------
            // Debounce
            // -------------------------------------------------

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
                event.key ===
                "ArrowDown"
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
                event.key ===
                "ArrowUp"
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
                event.key ===
                "Enter"
            ) {

                // If a suggestion is selected,
                // use that exact location.

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

                // If no suggestion is selected,
                // allow normal search handling.

            }


            // =================================================
            // ESCAPE
            // =================================================

            else if (
                event.key ===
                "Escape"
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
    // PUBLIC HIDE FUNCTION
    // =========================================================

    window.hideWeatherSuggestions =
        hideSuggestions;


    // =========================================================
    // PUBLIC REFRESH FUNCTION
    // =========================================================

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
    // INITIALIZATION
    // =========================================================

    console.log(
        "WeatherSphere - Autocomplete initialized successfully."
    );

});