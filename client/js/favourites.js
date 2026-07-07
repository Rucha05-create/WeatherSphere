// ===============================
// Load Favorite Cities
// ===============================

async function loadFavorites() {

    const response = await fetch(
        "http://localhost:5000/api/favourites"
    );

    const cities = await response.json();

    favoriteContainer.innerHTML = "";

    cities.forEach(city => {

        const card = document.createElement("div");

        card.className = "favoriteCard";

        card.innerHTML = `
            <span>${city.city}, ${city.country}</span>

            <button onclick="deleteFavorite('${city._id}')">
                ❌
            </button>
        `;

        card.addEventListener("click", () => {

            getWeather(city.city);

        });

        favoriteContainer.appendChild(card);

    });

}

// ===============================
// Save Favorite
// ===============================

async function saveFavorite(city, country) {

    await fetch(
        "http://localhost:5000/api/favourites",
        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                city,

                country

            })

        }
    );

    loadFavorites();

}

// ===============================
// Delete Favorite
// ===============================

async function deleteFavorite(id) {

    await fetch(
        `http://localhost:5000/api/favourites/${id}`,
        {

            method: "DELETE"

        }
    );

    loadFavorites();

}