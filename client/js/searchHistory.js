// ===============================
// Load Search History
// ===============================

async function loadSearchHistory() {

    const response = await fetch(
        "http://localhost:5000/api/search"
    );

    const history = await response.json();

    historyContainer.innerHTML = "";

    history.forEach(item => {

        const card = document.createElement("div");

        card.className = "historyCard";

        card.innerHTML = `
            <span>${item.city}, ${item.country}</span>

            <button onclick="deleteHistory('${item._id}')">
                🗑
            </button>
        `;

        card.addEventListener("click", () => {

            getWeather(item.city);

        });

        historyContainer.appendChild(card);

    });

}

// ===============================
// Save Search
// ===============================

async function saveSearch(city, country) {

    await fetch("http://localhost:5000/api/search", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            city,

            country

        })

    });

}

// ===============================
// Delete One Search
// ===============================

async function deleteHistory(id) {

    await fetch(
        `http://localhost:5000/api/search/${id}`,
        {

            method: "DELETE"

        }
    );

    loadSearchHistory();

}

// ===============================
// Clear History
// ===============================

async function clearHistory() {

    await fetch(
        "http://localhost:5000/api/search",

        {

            method: "DELETE"

        }

    );

    loadSearchHistory();

}