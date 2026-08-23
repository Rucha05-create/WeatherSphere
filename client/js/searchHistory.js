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

            <button class="delete-btn">
               🗑
           </button>
        `;

        const deleteBtn = card.querySelector(".delete-btn");

           deleteBtn.addEventListener("click", async (e) => {

           e.stopPropagation();

           await deleteHistory(item._id);

        });

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

    await loadSearchHistory();

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

    await loadSearchHistory();

}

const clearHistoryBtn = document.getElementById("clearHistoryBtn");

clearHistoryBtn.addEventListener("click", clearSearchHistory);