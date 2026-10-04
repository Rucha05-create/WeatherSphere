// ===============================
// Capitalize First Letter
// ===============================

function capitalize(text) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// ===============================
// Format Time (24-Hour)
// ===============================

function formatHour(dateTime) {
    // "2026-10-05 14:00" -> "14:00" (works on every browser)
    const timePart = String(dateTime).split(" ")[1] || "00:00";
    return timePart;
}

// ===============================
// Get Weekday Name
// ===============================

function getWeekday(dateString) {
    // "T00:00:00" keeps the date in local time, so the day never shifts
    return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "long"
    });
}

// ===============================
// Show / Hide Loading
// ===============================

const SEARCH_BTN_HTML = '<i class="fa-solid fa-magnifying-glass"></i> Search';

function showLoading() {
    searchBtn.innerHTML = "Searching...";
    searchBtn.disabled = true;
}

function hideLoading() {
    searchBtn.innerHTML = SEARCH_BTN_HTML;
    searchBtn.disabled = false;
}