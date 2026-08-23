// ============================================================
// WEATHERSPHERE - MAP.JS
// ============================================================

let map = null;
let marker = null;
let circle = null;


// ============================================================
// UPDATE WEATHER MAP
// ============================================================

function updateWeatherMap(data) {

    // --------------------------------------------------------
    // Get map container
    // --------------------------------------------------------

    const mapContainer =
        document.getElementById("weatherMap");


    if (!mapContainer) {

        console.error(
            "weatherMap container not found!"
        );

        return;

    }


    // --------------------------------------------------------
    // Get location
    // --------------------------------------------------------

    const latitude =
        data.location.lat;

    const longitude =
        data.location.lon;


    // --------------------------------------------------------
    // Check coordinates
    // --------------------------------------------------------

    if (
        latitude === undefined ||
        longitude === undefined
    ) {

        console.error(
            "Invalid latitude or longitude."
        );

        return;

    }


    // ========================================================
    // CREATE MAP
    // ========================================================

    if (!map) {

        map =
            L.map("weatherMap").setView(
                [latitude, longitude],
                10
            );


        // ----------------------------------------------------
        // OpenStreetMap Layer
        // ----------------------------------------------------

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {

                attribution:
                    "&copy; OpenStreetMap contributors"

            }
        ).addTo(map);

    }

    else {

        // ----------------------------------------------------
        // Move existing map
        // ----------------------------------------------------

        map.setView(
            [latitude, longitude],
            10
        );

    }


    // ========================================================
    // REMOVE OLD MARKER
    // ========================================================

    if (marker) {

        map.removeLayer(marker);

        marker = null;

    }


    // ========================================================
    // ADD NEW MARKER
    // ========================================================

    marker =
        L.marker([
            latitude,
            longitude
        ])


        .addTo(map)


        .bindPopup(`

            <div class="weather-popup">

                <strong>
                    ${data.location.name}
                </strong>

                <br>

                ${data.location.country}

                <hr>

                🌡 Temperature:
                ${data.current.temp_c}°C

                <br>

                🌡 Feels Like:
                ${data.current.feelslike_c}°C

                <br>

                ${data.current.condition.text}

                <br>

                💧 Humidity:
                ${data.current.humidity}%

                <br>

                💨 Wind:
                ${data.current.wind_kph} km/h

            </div>

        `)


        .openPopup();



    // ========================================================
    // REMOVE OLD CIRCLE
    // ========================================================

    if (circle) {

        map.removeLayer(circle);

        circle = null;

    }


    // ========================================================
    // ADD LOCATION CIRCLE
    // ========================================================

    circle =
        L.circle(
            [
                latitude,
                longitude
            ],
            {

                radius: 5000,

                color: "#2196f3",

                fillColor: "#64b5f6",

                fillOpacity: 0.3

            }
        ).addTo(map);


    // ========================================================
    // FIX MAP DISPLAY
    // ========================================================

    setTimeout(() => {

        if (map) {

            map.invalidateSize();

        }

    }, 200);


    console.log(
        "Weather map updated:",
        data.location.name
    );

}