// ============================================================
// WEATHERSPHERE - FAVOURITES.JS
// ============================================================
// Handles:
// 1. Loading favorite cities
// 2. Saving favorite cities
// 3. Deleting favorite cities
// 4. Opening weather for a favorite city
//
// IMPORTANT:
// Favorites are stored in localStorage.
// No backend / localhost:5000 is required.
// ============================================================


// ============================================================
// STORAGE KEY
// ============================================================

const FAVORITES_STORAGE_KEY =
    "weatherSphereFavorites";


// ============================================================
// GET FAVORITES FROM LOCAL STORAGE
// ============================================================

function getStoredFavorites() {

    try {

        const stored =
            localStorage.getItem(
                FAVORITES_STORAGE_KEY
            );


        if (!stored) {

            return [];

        }


        const favorites =
            JSON.parse(stored);


        if (!Array.isArray(favorites)) {

            return [];

        }


        return favorites;

    }

    catch (error) {

        console.error(
            "WeatherSphere - Error reading favorites:",
            error
        );

        return [];

    }

}


// ============================================================
// SAVE FAVORITES TO LOCAL STORAGE
// ============================================================

function setStoredFavorites(favorites) {

    try {

        localStorage.setItem(
            FAVORITES_STORAGE_KEY,
            JSON.stringify(favorites)
        );

        return true;

    }

    catch (error) {

        console.error(
            "WeatherSphere - Error saving favorites:",
            error
        );

        return false;

    }

}


// ============================================================
// LOAD FAVORITE CITIES
// ============================================================

function loadFavorites() {

    console.log(
        "WeatherSphere - Loading favorites..."
    );


    if (!favoriteContainer) {

        console.warn(
            "WeatherSphere - favoriteContainer not found."
        );

        return;

    }


    const cities =
        getStoredFavorites();


    favoriteContainer.innerHTML = "";


    // --------------------------------------------------------
    // No favorites
    // --------------------------------------------------------

    if (cities.length === 0) {

        const emptyMessage =
            document.createElement("p");


        emptyMessage.className =
            "empty-message";


        emptyMessage.textContent =
            "No favorite cities added yet.";


        favoriteContainer.appendChild(
            emptyMessage
        );


        return;

    }


    // --------------------------------------------------------
    // Display favorites
    // --------------------------------------------------------

    cities.forEach((city, index) => {

        const card =
            document.createElement("div");


        card.className =
            "favoriteCard";


        card.dataset.index =
            index;


        // ----------------------------------------------------
        // City information
        // ----------------------------------------------------

        const cityInfo =
            document.createElement("span");


        cityInfo.className =
            "favoriteCity";


        cityInfo.textContent =
            city.country
                ? `${city.city}, ${city.country}`
                : city.city;


        // ----------------------------------------------------
        // Delete button
        // ----------------------------------------------------

        const deleteButton =
            document.createElement("button");


        deleteButton.type =
            "button";


        deleteButton.className =
            "favoriteDelete";


        deleteButton.innerHTML =
            "❌";


        deleteButton.title =
            `Remove ${city.city} from favorites`;


        deleteButton.setAttribute(
            "aria-label",
            `Remove ${city.city} from favorites`
        );


        // ----------------------------------------------------
        // Delete favorite
        // ----------------------------------------------------

        deleteButton.addEventListener(
            "click",
            (event) => {

                // Prevent the card click
                event.stopPropagation();


                deleteFavorite(index);

            }
        );


        // ----------------------------------------------------
        // Open favorite weather
        // ----------------------------------------------------

        card.addEventListener(
            "click",
            () => {

                if (
                    typeof getWeather ===
                    "function"
                ) {

                    getWeather(
                        city.city
                    );

                }

                else {

                    console.error(
                        "WeatherSphere - getWeather() not found."
                    );

                }

            }
        );


        card.appendChild(
            cityInfo
        );


        card.appendChild(
            deleteButton
        );


        favoriteContainer.appendChild(
            card
        );

    });


    console.log(
        `WeatherSphere - ${cities.length} favorite(s) loaded.`
    );

}


// ============================================================
// SAVE FAVORITE CITY
// ============================================================

function saveFavorite(city, country) {

    // --------------------------------------------------------
    // Validate city
    // --------------------------------------------------------

    if (
        !city ||
        city.trim() === ""
    ) {

        alert(
            "Please search for a city first."
        );

        return;

    }


    const cleanCity =
        city.trim();


    const cleanCountry =
        country
            ? country.trim()
            : "";


    // --------------------------------------------------------
    // Get existing favorites
    // --------------------------------------------------------

    const favorites =
        getStoredFavorites();


    // --------------------------------------------------------
    // Check duplicate
    // --------------------------------------------------------

    const alreadyExists =
        favorites.some(
            favorite =>
                favorite.city.toLowerCase() ===
                cleanCity.toLowerCase()
        );


    if (alreadyExists) {

        alert(
            `${cleanCity} is already in your favorites.`
        );

        return;

    }


    // --------------------------------------------------------
    // Create favorite object
    // --------------------------------------------------------

    const favorite = {

        city:
            cleanCity,

        country:
            cleanCountry

    };


    // --------------------------------------------------------
    // Add favorite
    // --------------------------------------------------------

    favorites.push(
        favorite
    );


    // --------------------------------------------------------
    // Save
    // --------------------------------------------------------

    const saved =
        setStoredFavorites(
            favorites
        );


    if (!saved) {

        alert(
            "Unable to save this favorite city."
        );

        return;

    }


    console.log(
        "WeatherSphere - Favorite saved:",
        favorite
    );


    // --------------------------------------------------------
    // Refresh favorites
    // --------------------------------------------------------

    loadFavorites();


    // --------------------------------------------------------
    // Confirmation
    // --------------------------------------------------------

    alert(
        `${cleanCity} has been added to your favorites!`
    );

}


// ============================================================
// DELETE FAVORITE
// ============================================================

function deleteFavorite(index) {

    const favorites =
        getStoredFavorites();


    // --------------------------------------------------------
    // Validate index
    // --------------------------------------------------------

    if (
        index < 0 ||
        index >= favorites.length
    ) {

        console.warn(
            "WeatherSphere - Invalid favorite index."
        );

        return;

    }


    const cityName =
        favorites[index].city;


    // --------------------------------------------------------
    // Confirm deletion
    // --------------------------------------------------------

    const confirmed =
        confirm(
            `Remove ${cityName} from your favorites?`
        );


    if (!confirmed) {

        return;

    }


    // --------------------------------------------------------
    // Remove favorite
    // --------------------------------------------------------

    favorites.splice(
        index,
        1
    );


    // --------------------------------------------------------
    // Save updated list
    // --------------------------------------------------------

    const saved =
        setStoredFavorites(
            favorites
        );


    if (!saved) {

        alert(
            "Unable to remove the favorite city."
        );

        return;

    }


    console.log(
        "WeatherSphere - Favorite removed:",
        cityName
    );


    // --------------------------------------------------------
    // Refresh UI
    // --------------------------------------------------------

    loadFavorites();

}


// ============================================================
// CHECK IF CITY IS FAVORITE
// ============================================================

function isFavorite(city) {

    if (
        !city ||
        city.trim() === ""
    ) {

        return false;

    }


    const favorites =
        getStoredFavorites();


    return favorites.some(
        favorite =>
            favorite.city.toLowerCase() ===
            city.trim().toLowerCase()
    );

}


// ============================================================
// CLEAR ALL FAVORITES
// ============================================================

function clearFavorites() {

    const favorites =
        getStoredFavorites();


    if (favorites.length === 0) {

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to remove all favorite cities?"
        );


    if (!confirmed) {

        return;

    }


    localStorage.removeItem(
        FAVORITES_STORAGE_KEY
    );


    loadFavorites();


    console.log(
        "WeatherSphere - All favorites cleared."
    );

}


// ============================================================
// END OF FAVOURITES.JS
// ============================================================