// ============================================================
// WEATHERSPHERE - SAVEFAVOURITE.JS
// ============================================================
// Saves a favorite city in the browser (localStorage).
// No backend / localhost:5000 is needed.
//
// Uses the same storage key as favourites.js, so both files
// read and write the same list.
// ============================================================

function saveFavorite(city, country) {

    // Validate city
    if (!city || String(city).trim() === "") {
        alert("Please search for a city first.");
        return;
    }

    const cleanCity = String(city).trim();

    const cleanCountry = country ? String(country).trim() : "";

    const storageKey = "weatherSphereFavorites";

    // Read the existing favorites
    let favorites = [];

    try {
        favorites = JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch (error) {
        favorites = [];
    }

    if (!Array.isArray(favorites)) {
        favorites = [];
    }

    // Check for a duplicate
    const alreadyExists = favorites.some(
        favorite =>
            favorite.city.toLowerCase() === cleanCity.toLowerCase()
    );

    if (alreadyExists) {
        alert(`${cleanCity} is already in your favorites.`);
        return;
    }

    // Add and save
    favorites.push({
        city: cleanCity,
        country: cleanCountry
    });

    try {
        localStorage.setItem(storageKey, JSON.stringify(favorites));
    } catch (error) {
        console.error("WeatherSphere - Error saving favorite:", error);
        alert("Unable to save this favorite city.");
        return;
    }

    console.log("WeatherSphere - Favorite saved:", cleanCity);

    // Refresh the favorites list on the page
    if (typeof loadFavorites === "function") {
        loadFavorites();
    }

    alert(`${cleanCity} has been added to your favorites!`);

}