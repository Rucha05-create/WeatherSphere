async function getWeather(city){

    try{

        showLoading();

        const response = await fetch(`http://localhost:5000/api/weather/${city}`);

        const data = await response.json();

        if(data.error){

            alert(data.error.message);
            return;

        }

        updateCurrentWeather(data);
        updateHourlyForecast(data);
        updateWeeklyForecast(data);

    }

    catch(error){

        console.log(error);
        alert("Something went wrong.");

    }

    finally{

        hideLoading();

    }

}