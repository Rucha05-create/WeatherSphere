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

    const date = new Date(dateTime);

    return `${date.getHours()}:00`;

}

// ===============================
// Get Weekday Name
// ===============================

function getWeekday(dateString) {

    return new Date(dateString).toLocaleDateString("en-US", {

        weekday: "long"

    });

}

// ===============================
// Show Loading
// ===============================

function showLoading() {

    searchBtn.innerHTML = "Searching...";

    searchBtn.disabled = true;

}

// ===============================
// Hide Loading
// ===============================

function hideLoading() {

    searchBtn.innerHTML = "Search";

    searchBtn.disabled = false;

}