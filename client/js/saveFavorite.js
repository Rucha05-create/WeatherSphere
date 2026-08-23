async function saveFavorite(city, country) {

    try {

        const response = await fetch(
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

        const data = await response.json();

        console.log(data);

        loadFavorites();

    }

    catch(error){

        console.log(error);

    }

}