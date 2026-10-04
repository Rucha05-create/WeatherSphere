// ============================================================
// WEATHERSPHERE - AUTOCOMPLETE.JS
// ============================================================
// Handles:
// 1. Live location suggestions (WeatherAPI via api.js)
// 2. City / district / state / country display
// 3. Debounced requests
// 4. Keyboard navigation (arrows, Enter, Escape)
// 5. Mouse selection
// 6. Exact latitude/longitude search
// 7. Safe DOM rendering
// 8. Closing the dropdown
// ============================================================


document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // DOM ELEMENTS
    // ========================================================

    const input = document.getElementById("cityInput");

    const suggestionsBox = document.getElementById("suggestions");

    if (!input) {
        console.error("WeatherSphere Autocomplete: cityInput not found.");
        return;
    }

    if (!suggestionsBox) {
        console.error("WeatherSphere Autocomplete: suggestions container not found.");
        return;
    }


    // ========================================================
    // VARIABLES
    // ========================================================

    let debounceTimer = null;

    let selectedIndex = -1;

    let currentLocations = [];

    let requestId = 0;


    // ========================================================
    // HIDE / DISPLAY SUGGESTIONS
    // ========================================================

    function hideSuggestions() {

        suggestionsBox.innerHTML = "";

        suggestionsBox.style.display = "none";

        suggestionsBox.classList.remove("show");

        selectedIndex = -1;

        currentLocations = [];

    }

    function displaySuggestions() {

        suggestionsBox.style.display = "block";

        suggestionsBox.classList.add("show");

    }


    // ========================================================
    // NORMALIZE LOCATION
    // ========================================================

    function normalizeLocation(location) {

        if (!location) {
            return null;
        }

        const latitude = location.lat ?? location.latitude ?? null;

        const longitude =
            location.lon ?? location.lng ?? location.longitude ?? null;

        return {

            name: location.name || location.city || "Unknown Location",

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

            country: location.country || "",

            lat: latitude !== null ? Number(latitude) : null,

            lon: longitude !== null ? Number(longitude) : null

        };

    }


    // ========================================================
    // LOCATION DETAILS
    // ========================================================

    function getLocationParts(details) {

        const parts = [];

        if (details.district) {
            parts.push(details.district);
        }

        if (details.region && details.region !== details.district) {
            parts.push(details.region);
        }

        if (details.country) {
            parts.push(details.country);
        }

        return parts;

    }

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

    function hasCoordinates(location) {

        return (
            location &&
            location.lat !== null &&
            location.lon !== null &&
            Number.isFinite(Number(location.lat)) &&
            Number.isFinite(Number(location.lon))
        );

    }


    // ========================================================
    // SHOW SUGGESTIONS
    // ========================================================

    function showSuggestions(locations) {

        suggestionsBox.innerHTML = "";

        selectedIndex = -1;

        if (!Array.isArray(locations) || locations.length === 0) {
            hideSuggestions();
            return;
        }

        // Keep up to 10 results
        currentLocations = locations
            .map(normalizeLocation)
            .filter(Boolean)
            .slice(0, 10);

        if (currentLocations.length === 0) {
            hideSuggestions();
            return;
        }

        currentLocations.forEach((location, index) => {

            // Main item
            const item = document.createElement("div");

            item.className = "suggestion";

            item.setAttribute("role", "option");

            item.setAttribute("data-index", index);

            item.setAttribute("aria-selected", "false");

            // Title
            const title = document.createElement("div");

            title.className = "suggestion-title";

            const icon = document.createElement("i");

            icon.className = "fa-solid fa-location-dot";

            const strong = document.createElement("strong");

            strong.textContent = location.name;

            title.appendChild(icon);

            title.appendChild(strong);

            // Location information
            const locationParts = getLocationParts(location);

            const locationInfo = document.createElement("div");

            locationInfo.className = "suggestion-location";

            locationInfo.textContent = locationParts.join(" • ");

            // Coordinates
            const coordinates = document.createElement("small");

            coordinates.className = "suggestion-coordinates";

            coordinates.textContent = hasCoordinates(location)
                ? `📍 ${Number(location.lat).toFixed(4)}, ${Number(location.lon).toFixed(4)}`
                : "📍 Coordinates unavailable";

            // Append
            item.appendChild(title);

            if (locationParts.length > 0) {
                item.appendChild(locationInfo);
            }

            item.appendChild(coordinates);

            // Mouse enter
            item.addEventListener("mouseenter", () => {
                selectedIndex = index;
                updateSelectedItem();
            });

            // Prevent the input from losing focus
            item.addEventListener("mousedown", (event) => {
                event.preventDefault();
            });

            // Click
            item.addEventListener("click", () => {
                selectLocation(location);
            });

            suggestionsBox.appendChild(item);

        });

        displaySuggestions();

    }


    // ========================================================
    // SELECT LOCATION
    // ========================================================

    function selectLocation(location) {

        if (!location) {
            return;
        }

        input.value = location.name;

        hideSuggestions();

        if (typeof getWeather !== "function") {
            console.error("Autocomplete: getWeather() is not available.");
            return;
        }

        // Exact coordinates avoid mix-ups between places with the
        // same name (for example Jalgaon in India and Bangladesh).
        if (hasCoordinates(location)) {

            const coordinates = `${location.lat},${location.lon}`;

            console.log("WeatherSphere - Selected location:", location.name);

            console.log("WeatherSphere - Exact coordinates:", coordinates);

            getWeather(coordinates);

            return;

        }

        const searchQuery = buildLocationQuery(location);

        console.log("WeatherSphere - Using location query:", searchQuery);

        getWeather(searchQuery);

    }


    // ========================================================
    // UPDATE SELECTED ITEM
    // ========================================================

    function updateSelectedItem() {

        const items = suggestionsBox.querySelectorAll(".suggestion");

        items.forEach((item, index) => {

            const isSelected = index === selectedIndex;

            item.classList.toggle("suggestion-selected", isSelected);

            item.setAttribute("aria-selected", isSelected ? "true" : "false");

        });

        if (selectedIndex >= 0 && items[selectedIndex]) {
            items[selectedIndex].scrollIntoView({ block: "nearest" });
        }

    }


    // ========================================================
    // GET SUGGESTIONS (uses api.js)
    // ========================================================

    async function getSuggestions(query) {

        const currentRequest = ++requestId;

        try {

            const locations = await fetchLocationSuggestions(query);

            // Ignore old responses if the user kept typing
            if (currentRequest !== requestId) {
                return;
            }

            if (input.value.trim() !== query) {
                return;
            }

            showSuggestions(locations);

        } catch (error) {

            console.error("WeatherSphere Autocomplete Error:", error);

            hideSuggestions();

        }

    }


    // ========================================================
    // INPUT EVENT
    // ========================================================

    input.addEventListener("input", () => {

        const query = input.value.trim();

        clearTimeout(debounceTimer);

        selectedIndex = -1;

        // Minimum 2 characters
        if (query.length < 2) {
            hideSuggestions();
            return;
        }

        debounceTimer = setTimeout(() => {
            getSuggestions(query);
        }, 350);

    });


    // ========================================================
    // KEYBOARD NAVIGATION
    // ========================================================

    input.addEventListener("keydown", (event) => {

        const items = suggestionsBox.querySelectorAll(".suggestion");

        const dropdownVisible = suggestionsBox.style.display !== "none";

        if (!items.length || !dropdownVisible) {
            return;
        }

        if (event.key === "ArrowDown") {

            event.preventDefault();

            selectedIndex++;

            if (selectedIndex >= items.length) {
                selectedIndex = 0;
            }

            updateSelectedItem();

        } else if (event.key === "ArrowUp") {

            event.preventDefault();

            selectedIndex--;

            if (selectedIndex < 0) {
                selectedIndex = items.length - 1;
            }

            updateSelectedItem();

        } else if (event.key === "Enter") {

            // Only handle Enter when a suggestion is highlighted.
            // Otherwise app.js runs the normal search.
            if (selectedIndex >= 0 && selectedIndex < items.length) {

                event.preventDefault();

                selectLocation(currentLocations[selectedIndex]);

            }

        } else if (event.key === "Escape") {

            event.preventDefault();

            hideSuggestions();

        }

    });


    // ========================================================
    // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    // ========================================================

    document.addEventListener("click", (event) => {

        if (!event.target.closest(".search-box")) {
            hideSuggestions();
        }

    });


    // ========================================================
    // INPUT BLUR
    // ========================================================

    input.addEventListener("blur", () => {

        setTimeout(() => {

            if (
                !suggestionsBox.matches(":hover") &&
                document.activeElement !== input
            ) {
                hideSuggestions();
            }

        }, 200);

    });


    // ========================================================
    // PUBLIC FUNCTIONS (used by app.js)
    // ========================================================

    window.hideWeatherSuggestions = hideSuggestions;

    window.refreshWeatherSuggestions = function () {

        const query = input.value.trim();

        if (query.length >= 2) {
            getSuggestions(query);
        }

    };

    console.log("WeatherSphere - Autocomplete initialized successfully.");

});