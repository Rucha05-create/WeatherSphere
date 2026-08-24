// ============================================================
// FORECAST.JS
// WeatherSphere
// ============================================================


// ============================================================
// 24 HOUR FORECAST
// ============================================================

function updateHourlyForecast(data) {

    const hourContainer =
        document.getElementById("hourContainer");

    // Safety check
    if (!hourContainer) {

        console.error("❌ hourContainer not found!");

        return;
    }

    // Clear previous forecast
    hourContainer.innerHTML = "";

    // Safety check for API data
    if (
        !data ||
        !data.forecast ||
        !data.forecast.forecastday ||
        data.forecast.forecastday.length === 0
    ) {

        hourContainer.innerHTML = `
            <p class="no-data">
                No hourly forecast available.
            </p>
        `;

        return;
    }


    // ========================================================
    // GET CURRENT TIME FROM WEATHER API LOCATION
    // ========================================================

    let currentHour = 0;

    try {

        /*
         * WeatherAPI localtime format:
         * 2026-08-24 19:30
         */

        const localTime =
            data.location.localtime;

        if (localTime) {

            const timePart =
                localTime.split(" ")[1];

            currentHour =
                parseInt(
                    timePart.split(":")[0]
                );

        }

    }
    catch (error) {

        console.warn(
            "Could not determine local hour. Using current system hour."
        );

        currentHour =
            new Date().getHours();

    }


    // ========================================================
    // GET TODAY'S HOURLY DATA
    // ========================================================

    const today =
        data.forecast.forecastday[0];


    let hours = [];


    if (today.hour) {

        hours =
            today.hour.filter(hour => {

                const hourTime =
                    parseInt(
                        hour.time.split(" ")[1].split(":")[0]
                    );

                return hourTime >= currentHour;

            });

    }


    // ========================================================
    // GET TOMORROW'S HOURS IF REQUIRED
    // ========================================================

    if (
        hours.length < 24 &&
        data.forecast.forecastday.length > 1
    ) {

        const tomorrow =
            data.forecast.forecastday[1];

        if (tomorrow.hour) {

            hours = [
                ...hours,
                ...tomorrow.hour
            ];

        }

    }


    // ========================================================
    // LIMIT TO 24 HOURS
    // ========================================================

    hours =
        hours.slice(0, 24);


    // ========================================================
    // DISPLAY NO DATA MESSAGE
    // ========================================================

    if (hours.length === 0) {

        hourContainer.innerHTML = `

            <div class="no-data">

                <p>
                    No hourly forecast available.
                </p>

            </div>

        `;

        return;
    }


    // ========================================================
    // CREATE HOURLY FORECAST CARDS
    // ========================================================

    hours.forEach((hour, index) => {

        const card =
            document.createElement("div");


        card.className =
            "hourCard";


        // ====================================================
        // TIME
        // ====================================================

        let timeText =
            formatHour(hour.time);


        // Show "Now" for first/current card
        if (index === 0) {

            timeText = "Now";

        }


        // ====================================================
        // TEMPERATURE
        // ====================================================

        const temperature =
            hour.temp_c !== undefined
                ? hour.temp_c
                : "--";


        // ====================================================
        // WEATHER CONDITION
        // ====================================================

        const condition =
            hour.condition &&
            hour.condition.text
                ? hour.condition.text
                : "Unknown";


        // ====================================================
        // WEATHER ICON
        // ====================================================

        let icon = "";

        if (
            hour.condition &&
            hour.condition.icon
        ) {

            icon =
                hour.condition.icon.startsWith("http")
                    ? hour.condition.icon
                    : "https:" + hour.condition.icon;

        }


        // ====================================================
        // RAIN CHANCE
        // ====================================================

        const rainChance =
            hour.chance_of_rain !== undefined
                ? hour.chance_of_rain
                : 0;


        // High rain class
        const rainClass =
            rainChance >= 60
                ? "high-rain"
                : "";


        // Rain icon
        const rainIcon =
            rainChance >= 60
                ? "☔"
                : "🌧";


        // ====================================================
        // CREATE CARD
        // ====================================================

        card.innerHTML = `

            <h3>
                ${timeText}
            </h3>

            ${
                icon
                    ? `
                        <img
                            src="${icon}"
                            alt="${condition}"
                            loading="lazy"
                        >
                    `
                    : `
                        <div
                            style="
                                font-size:40px;
                                margin:15px 0;
                            "
                        >
                            🌤
                        </div>
                    `
            }

            <p class="temp">
                ${temperature}°C
            </p>

            <small>
                ${condition}
            </small>

            <p class="rain ${rainClass}">
                ${rainIcon}
                ${rainChance}% Chance of Rain
            </p>

        `;


        // Add card to container
        hourContainer.appendChild(card);

    });


    console.log(
        "✅ Hourly forecast loaded:",
        hours.length,
        "hours"
    );

}



// ============================================================
// 7 DAY FORECAST
// ============================================================

function updateWeeklyForecast(data) {

    const weeklyForecast =
        document.getElementById(
            "weeklyForecast"
        );


    // Safety check
    if (!weeklyForecast) {

        console.error(
            "❌ weeklyForecast element not found!"
        );

        return;
    }


    // Clear previous forecast
    weeklyForecast.innerHTML = "";


    // ========================================================
    // CHECK API DATA
    // ========================================================

    if (
        !data ||
        !data.forecast ||
        !data.forecast.forecastday ||
        data.forecast.forecastday.length === 0
    ) {

        weeklyForecast.innerHTML = `

            <tr>

                <td colspan="3">

                    No weekly forecast available.

                </td>

            </tr>

        `;

        return;
    }


    // ========================================================
    // LOOP THROUGH FORECAST DAYS
    // ========================================================

    data.forecast.forecastday.forEach(
        (day, index) => {


            const row =
                document.createElement("tr");


            // =================================================
            // DAY NAME
            // =================================================

            let weekday;


            if (index === 0) {

                weekday = "Today";

            }

            else {

                weekday =
                    getWeekday(day.date);

            }


            // =================================================
            // DATE
            // =================================================

            const formattedDate =
                formatDate(day.date);


            // =================================================
            // WEATHER ICON
            // =================================================

            let icon = "";

            if (
                day.day &&
                day.day.condition &&
                day.day.condition.icon
            ) {

                icon =
                    day.day.condition.icon.startsWith("http")
                        ? day.day.condition.icon
                        : "https:" +
                          day.day.condition.icon;

            }


            // =================================================
            // WEATHER CONDITION
            // =================================================

            const condition =
                day.day &&
                day.day.condition
                    ? day.day.condition.text
                    : "Unknown";


            // =================================================
            // TEMPERATURE
            // =================================================

            const avgTemp =
                day.day &&
                day.day.avgtemp_c !== undefined
                    ? day.day.avgtemp_c
                    : "--";


            const minTemp =
                day.day &&
                day.day.mintemp_c !== undefined
                    ? day.day.mintemp_c
                    : "--";


            const maxTemp =
                day.day &&
                day.day.maxtemp_c !== undefined
                    ? day.day.maxtemp_c
                    : "--";


            // =================================================
            // RAIN CHANCE
            // =================================================

            const rainChance =
                day.day &&
                day.day.daily_chance_of_rain !== undefined
                    ? day.day.daily_chance_of_rain
                    : 0;


            // =================================================
            // CREATE TABLE ROW
            // =================================================

            row.innerHTML = `

                <td>

                    <strong>
                        ${weekday}
                    </strong>

                    <br>

                    <small>
                        ${formattedDate}
                    </small>

                </td>


                <td>

                    ${
                        icon
                            ? `
                                <img
                                    src="${icon}"
                                    alt="${condition}"
                                    style="
                                        width:45px;
                                        vertical-align:middle;
                                        margin-right:10px;
                                    "
                                >
                            `
                            : `
                                <span
                                    style="
                                        font-size:30px;
                                        margin-right:10px;
                                    "
                                >
                                    🌤
                                </span>
                            `
                    }

                    ${condition}

                    <br>

                    <small>
                        🌧 ${rainChance}% rain
                    </small>

                </td>


                <td>

                    <strong>
                        ${avgTemp}°C
                    </strong>

                    <br>

                    <small>
                        ${minTemp}°C -
                        ${maxTemp}°C
                    </small>

                </td>

            `;


            // Add row
            weeklyForecast.appendChild(row);

        }
    );


    console.log(
        "✅ Weekly forecast loaded:",
        data.forecast.forecastday.length,
        "days"
    );

}



// ============================================================
// FORMAT HOUR
// ============================================================

function formatHour(time) {

    if (!time) {

        return "--";

    }


    try {

        /*
         * WeatherAPI format:
         * 2026-08-24 19:30
         */

        const timePart =
            time.includes(" ")
                ? time.split(" ")[1]
                : time;


        let parts =
            timePart.split(":");


        let hours =
            parseInt(parts[0]);


        const minutes =
            parts[1] || "00";


        const ampm =
            hours >= 12
                ? "PM"
                : "AM";


        hours =
            hours % 12;


        hours =
            hours || 12;


        return `${hours}:${minutes} ${ampm}`;

    }

    catch (error) {

        console.error(
            "Error formatting hour:",
            error
        );

        return time;

    }

}



// ============================================================
// GET WEEKDAY
// ============================================================

function getWeekday(dateString) {

    if (!dateString) {

        return "--";

    }


    try {

        /*
         * Use local date string without timezone
         * to avoid date shifting.
         */

        const date =
            new Date(
                dateString + "T00:00:00"
            );


        return date.toLocaleDateString(
            "en-US",
            {
                weekday: "long"
            }
        );

    }

    catch (error) {

        console.error(
            "Error getting weekday:",
            error
        );

        return dateString;

    }

}



// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(dateString) {

    if (!dateString) {

        return "--";

    }


    try {

        const date =
            new Date(
                dateString + "T00:00:00"
            );


        return date.toLocaleDateString(
            "en-US",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }

    catch (error) {

        return dateString;

    }

}