const suggestions = document.getElementById("suggestions");

cityInput.addEventListener("input", async () => {

    const query = cityInput.value.trim();

    if (query.length < 2) {

        suggestions.innerHTML = "";
        suggestions.style.display = "none";
        return;
    }

    try {

        const response = await fetch(
            `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`
        );

        const cities = await response.json();

        suggestions.innerHTML = "";

        if (!cities.length) {

            suggestions.style.display = "none";
            return;
        }

        suggestions.style.display = "block";

        cities.forEach(city => {

            const item = document.createElement("div");

            item.className = "suggestion";

            item.innerHTML = `
                <i class="fa-solid fa-location-dot"></i>
                ${city.name}, ${city.region}, ${city.country}
            `;

            item.addEventListener("click", () => {

                cityInput.value = `${city.name}, ${city.country}`;

                suggestions.innerHTML = "";

                suggestions.style.display = "none";

                getWeather(`${city.name}, ${city.country}`);

            });

            suggestions.appendChild(item);

        });

    } catch (error) {

        console.log(error);

    }

});

document.addEventListener("click", (e) => {

    if (!cityInput.contains(e.target) &&
        !suggestions.contains(e.target)) {

        suggestions.style.display = "none";
    }

});