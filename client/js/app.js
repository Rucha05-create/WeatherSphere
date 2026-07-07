searchBtn.addEventListener("click",()=>{

    const city=cityInput.value.trim();

    if(city){

        getWeather(city);

    }

});

cityInput.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        const city=cityInput.value.trim();

        if(city){

            getWeather(city);

        }

    }

});

window.onload=()=>
{

    cityInput.focus();

    getWeather("Pune");

    loadFavorites();

    clearHistoryBtn.addEventListener("click",clearHistory);
};

const locationBtn = document.getElementById("locationBtn");

locationBtn.addEventListener("click", () => {

    navigator.geolocation.getCurrentPosition(

        async(position)=>{

            const lat=position.coords.latitude;

            const lon=position.coords.longitude;

            getWeather(`${lat},${lon}`);

        }

    );

});

favBtn.addEventListener("click", () => {

    saveFavorite(

        cityName.textContent,

        countryName.textContent

    );

});