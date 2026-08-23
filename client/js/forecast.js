// ============================================================
// FORECAST.JS
// ============================================================


// ============================================================
// 24 HOUR FORECAST
// ============================================================

function updateHourlyForecast(data) {

    // Get the container
    const hourContainer =
        document.getElementById("hourContainer");


    // Safety check
    if (!hourContainer) {

        console.error(
            "hourContainer not found!"
        );

        return;

    }


    // Clear previous forecast
    hourContainer.innerHTML = "";


    // ========================================================
    // GET TODAY'S HOURLY DATA
    // ========================================================

    const today =
        data.forecast.forecastday[0];


    const currentHour =
        new Date().getHours();


    /*
     * WeatherAPI gives 24 hours starting from 00:00.
     * We display the current hour and upcoming hours.
     */

    let hours =
        today.hour.filter(hour => {

            const hourTime =
                new Date(hour.time).getHours();

            return hourTime >= currentHour;

        });


    // If there are not enough hours left today,
    // get remaining hours from tomorrow
    if (hours.length < 12 && data.forecast.forecastday[1]) {

        const tomorrow =
            data.forecast.forecastday[1];


        hours = [
            ...hours,
            ...tomorrow.hour
        ];

    }


    // Display maximum 24 hours
    hours =
        hours.slice(0, 24);



    // ========================================================
    // CREATE HOURLY CARDS
    // ========================================================

    hours.forEach(hour => {

        const card =
            document.createElement("div");


        card.className =
            "hourCard";


        // ----------------------------------------------------
        // Rain Chance
        // ----------------------------------------------------

        const rainChance =
            hour.chance_of_rain || 0;


        // High rain class
        const rainClass =
            rainChance >= 60
                ? "high-rain"
                : "";


        // ----------------------------------------------------
        // Weather Icon
        // ----------------------------------------------------

        const icon =
            "https:" +
            hour.condition.icon;


        // ----------------------------------------------------
        // Format Time
        // ----------------------------------------------------

        const time =
            formatHour(hour.time);


        // ----------------------------------------------------
        // Card HTML
        // ----------------------------------------------------

        card.innerHTML = `

            <h3>
                ${time}
            </h3>

            <img
                src="${icon}"
                alt="${hour.condition.text}"
            >

            <p class="temp">
                ${hour.temp_c}°C
            </p>

            <small>
                ${hour.condition.text}
            </small>

            <p class="rain ${rainClass}">
                🌧 ${rainChance}% Chance of Rain
            </p>

        `;


        // Add card
        hourContainer.appendChild(card);

    });


    // ========================================================
    // NO DATA MESSAGE
    // ========================================================

    if (hours.length === 0) {

        hourContainer.innerHTML = `

            <p class="no-data">
                No hourly forecast available.
            </p>

        `;

    }

}



// ============================================================
// 7 DAY FORECAST
// ============================================================

function updateWeeklyForecast(data) {

    // Get table body
    const weeklyForecast =
        document.getElementById(
            "weeklyForecast"
        );


    // Safety check
    if (!weeklyForecast) {

        console.error(
            "weeklyForecast element not found!"
        );

        return;

    }


    // Clear old data
    weeklyForecast.innerHTML = "";


    // ========================================================
    // LOOP THROUGH 7 DAYS
    // ========================================================

    data.forecast.forecastday.forEach(
        (day, index) => {


            const row =
                document.createElement("tr");


            // ------------------------------------------------
            // Day Name
            // ------------------------------------------------

            let weekday;


            if (index === 0) {

                weekday = "Today";

            }

            else {

                weekday =
                    getWeekday(day.date);

            }


            // ------------------------------------------------
            // Weather Icon
            // ------------------------------------------------

            const icon =
                "https:" +
                day.day.condition.icon;


            // ------------------------------------------------
            // Temperature
            // ------------------------------------------------

            const avgTemp =
                day.day.avgtemp_c;


            // ------------------------------------------------
            // Min / Max Temperature
            // ------------------------------------------------

            const minTemp =
                day.day.mintemp_c;


            const maxTemp =
                day.day.maxtemp_c;


            // ------------------------------------------------
            // Rain Chance
            // ------------------------------------------------

            const rainChance =
                day.day.daily_chance_of_rain || 0;


            // ------------------------------------------------
            // Create Table Row
            // ------------------------------------------------

            row.innerHTML = `

                <td>
                    <strong>
                        ${weekday}
                    </strong>

                    <br>

                    <small>
                        ${day.date}
                    </small>
                </td>


                <td>

                    <img
                        src="${icon}"
                        alt="${day.day.condition.text}"
                        style="
                            width:45px;
                            vertical-align:middle;
                            margin-right:10px;
                        "
                    >

                    ${day.day.condition.text}

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


    // ========================================================
    // NO DATA MESSAGE
    // ========================================================

    if (
        data.forecast.forecastday.length === 0
    ) {

        weeklyForecast.innerHTML = `

            <tr>

                <td colspan="3">

                    No weekly forecast available.

                </td>

            </tr>

        `;

    }

}



// ============================================================
// FORMAT HOUR
// ============================================================

function formatHour(time) {

    const date =
        new Date(time);


    let hours =
        date.getHours();


    const minutes =
        String(
            date.getMinutes()
        ).padStart(2, "0");


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



// ============================================================
// GET WEEKDAY
// ============================================================

function getWeekday(dateString) {

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