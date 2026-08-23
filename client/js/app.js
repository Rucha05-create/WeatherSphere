document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // SEARCH WEATHER
    // =========================================================

    searchBtn.addEventListener("click", () => {

        const city = cityInput.value.trim();

        if (city) {
            getWeather(city);
        }

    });


    // =========================================================
    // SEARCH USING ENTER KEY
    // =========================================================

    cityInput.addEventListener("keypress", (e) => {

        if (e.key === "Enter") {

            const city = cityInput.value.trim();

            if (city) {
                getWeather(city);
            }

        }

    });


    // =========================================================
    // CURRENT LOCATION
    // =========================================================

    const locationBtn =
        document.getElementById("locationBtn");


    if (locationBtn) {

        locationBtn.addEventListener("click", () => {

            if (!navigator.geolocation) {

                alert(
                    "Geolocation is not supported by your browser."
                );

                return;
            }


            navigator.geolocation.getCurrentPosition(

                (position) => {

                    const lat =
                        position.coords.latitude;

                    const lon =
                        position.coords.longitude;


                    getWeather(
                        `${lat},${lon}`
                    );

                },

                () => {

                    alert(
                        "Unable to get your current location."
                    );

                }

            );

        });

    }


    // =========================================================
    // ADD TO FAVORITES
    // =========================================================

    favBtn.addEventListener("click", () => {

        if (
            !cityName.textContent ||
            cityName.textContent === "--"
        ) {

            alert(
                "Please search for a city first."
            );

            return;
        }


        saveFavorite(
            cityName.textContent,
            countryName.textContent
        );

    });


    // =========================================================
    // LOAD FAVORITES
    // =========================================================

    if (typeof loadFavorites === "function") {

        loadFavorites();

    }


    // =========================================================
    // INITIAL DEMO FORECAST
    // =========================================================

    /*
     * This prevents the forecast section from appearing blank
     * before the API returns data.
     */

    if (
        typeof showDemoHourlyForecast === "function"
    ) {

        showDemoHourlyForecast();

    }


    if (
        typeof showDemoWeeklyForecast === "function"
    ) {

        showDemoWeeklyForecast();

    }

});