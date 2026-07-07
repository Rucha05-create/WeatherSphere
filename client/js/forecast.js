// ===============================
// 24 HOUR FORECAST
// ===============================

function updateHourlyForecast(data) {

    hourContainer.innerHTML = "";

    data.forecast.forecastday[0].hour.forEach(hour => {

        const card = document.createElement("div");

        card.className = "hourCard";

        // Add class if rain chance is high
        const rainClass = hour.chance_of_rain >= 60 ? "high-rain" : "";

        // Change icon based on rain chance
        const rainIcon = hour.chance_of_rain >= 60 ? "☔" : "🌧";

        card.innerHTML = `
            <h3>${formatHour(hour.time)}</h3>

            <img src="https:${hour.condition.icon}" alt="Weather Icon">

            <p class="temp">${hour.temp_c}°C</p>

            <small>${hour.condition.text}</small>

            <p class="rain ${rainClass}">
                ${rainIcon} ${hour.chance_of_rain}% Chance of Rain
            </p>
        `;

        hourContainer.appendChild(card);

    });

}

// ===============================
// 7 DAY FORECAST
// ===============================

function updateWeeklyForecast(data) {

    weeklyForecast.innerHTML = "";

    data.forecast.forecastday.forEach(day => {

        const weekday = getWeekday(day.date);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${weekday}</td>

            <td>
                <img src="https:${day.day.condition.icon}" alt="Weather Icon">
                ${day.day.condition.text}
            </td>

            <td>${day.day.avgtemp_c}°C</td>
        `;

        weeklyForecast.appendChild(row);

    });

}