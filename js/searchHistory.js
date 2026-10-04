// ============================================================
// WEATHERSPHERE - SEARCHHISTORY.JS
// ============================================================
// Stores recent searches in the browser (localStorage).
// No backend is required.
//
// NOTE: clearHistoryBtn and historyContainer are already
// declared in config.js, so they are NOT declared again here.
// The Clear History button click is handled in app.js.
// ============================================================

const HISTORY_STORAGE_KEY = "weatherSearchHistory";

const MAX_HISTORY_ITEMS = 10;


// ============================================================
// READ / WRITE STORAGE
// ============================================================

function getStoredHistory() {

    try {

        const stored = localStorage.getItem(HISTORY_STORAGE_KEY);

        if (!stored) {
            return [];
        }

        const history = JSON.parse(stored);

        return Array.isArray(history) ? history : [];

    } catch (error) {

        console.error("WeatherSphere - Error reading history:", error);

        return [];

    }

}

function setStoredHistory(history) {

    try {

        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));

        return true;

    } catch (error) {

        console.error("WeatherSphere - Error saving history:", error);

        return false;

    }

}


// ============================================================
// LOAD SEARCH HISTORY
// ============================================================

function loadSearchHistory() {

    if (!historyContainer) {
        return;
    }

    const history = getStoredHistory();

    historyContainer.innerHTML = "";

    // No history
    if (history.length === 0) {

        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty-message";

        emptyMessage.textContent = "No recent searches.";

        historyContainer.appendChild(emptyMessage);

        return;

    }

    history.forEach((item, index) => {

        const card = document.createElement("div");

        card.className = "historyCard";

        // Label
        const label = document.createElement("span");

        label.textContent = item.country
            ? `${item.city}, ${item.country}`
            : item.city;

        // Delete button
        const deleteBtn = document.createElement("button");

        deleteBtn.type = "button";

        deleteBtn.className = "delete-btn";

        deleteBtn.textContent = "🗑";

        deleteBtn.title = `Remove ${item.city} from history`;

        deleteBtn.addEventListener("click", (event) => {

            event.stopPropagation();

            deleteHistory(index);

        });

        // Click the card to search again
        card.addEventListener("click", () => {

            getWeather(
                item.country
                    ? `${item.city}, ${item.country}`
                    : item.city
            );

        });

        card.appendChild(label);

        card.appendChild(deleteBtn);

        historyContainer.appendChild(card);

    });

}


// ============================================================
// SAVE SEARCH
// ============================================================

function saveSearch(city, country) {

    if (!city || String(city).trim() === "") {
        return;
    }

    const cleanCity = String(city).trim();

    const cleanCountry = country ? String(country).trim() : "";

    // Remove an older copy of the same place, then add it first
    let history = getStoredHistory().filter(item =>
        !(
            item.city.toLowerCase() === cleanCity.toLowerCase() &&
            (item.country || "").toLowerCase() === cleanCountry.toLowerCase()
        )
    );

    history.unshift({
        city: cleanCity,
        country: cleanCountry
    });

    // Keep only the latest searches
    history = history.slice(0, MAX_HISTORY_ITEMS);

    setStoredHistory(history);

}


// ============================================================
// DELETE ONE SEARCH
// ============================================================

function deleteHistory(index) {

    const history = getStoredHistory();

    if (index < 0 || index >= history.length) {
        return;
    }

    history.splice(index, 1);

    setStoredHistory(history);

    loadSearchHistory();

}


// ============================================================
// CLEAR ALL HISTORY
// ============================================================
// Called by the Clear History button (see app.js).

function clearSearchHistory() {

    localStorage.removeItem(HISTORY_STORAGE_KEY);

    loadSearchHistory();

}