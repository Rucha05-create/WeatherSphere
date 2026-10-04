// ============================================================
// WEATHERSPHERE - CHARTS.JS
// ============================================================

let chart = null;


// ============================================================
// UPDATE 24 HOUR TEMPERATURE CHART
// ============================================================

function updateTemperatureChart(data) {

    // --------------------------------------------------------
    // Get Canvas
    // --------------------------------------------------------

    const temperatureChart =
        document.getElementById("temperatureChart");


    if (!temperatureChart) {

        console.error(
            "temperatureChart canvas not found!"
        );

        return;

    }


    // --------------------------------------------------------
    // Check API Data
    // --------------------------------------------------------

    if (
        !data ||
        !data.forecast ||
        !data.forecast.forecastday ||
        data.forecast.forecastday.length === 0
    ) {

        console.error(
            "Temperature chart: forecast data unavailable."
        );

        return;

    }


    // --------------------------------------------------------
    // Get Current Time
    // --------------------------------------------------------

    const currentTime =
        new Date();


    // --------------------------------------------------------
    // Get Today's Hours
    // --------------------------------------------------------

    let hours =
        data.forecast.forecastday[0].hour;


    // --------------------------------------------------------
    // Get Upcoming Hours
    // --------------------------------------------------------

    let upcomingHours =
        hours.filter(hour => {

            const hourTime =
                new Date(hour.time);


            return (
                hourTime.getTime() >=
                currentTime.getTime()
            );

        });


    // --------------------------------------------------------
    // Add Tomorrow's Hours if Required
    // --------------------------------------------------------

    if (
        upcomingHours.length < 24 &&
        data.forecast.forecastday.length > 1
    ) {

        const tomorrowHours =
            data.forecast.forecastday[1].hour;


        const remaining =
            24 - upcomingHours.length;


        upcomingHours =
            upcomingHours.concat(
                tomorrowHours.slice(
                    0,
                    remaining
                )
            );

    }


    // --------------------------------------------------------
    // Maximum 24 Hours
    // --------------------------------------------------------

    upcomingHours =
        upcomingHours.slice(0, 24);


    // --------------------------------------------------------
    // Labels
    // --------------------------------------------------------

    const labels =
        upcomingHours.map(hour =>
            formatHour(hour.time)
        );


    // --------------------------------------------------------
    // Temperatures
    // --------------------------------------------------------

    const temperatures =
        upcomingHours.map(hour =>
            hour.temp_c
        );


    // --------------------------------------------------------
    // Destroy Previous Chart
    // --------------------------------------------------------

    if (chart) {

        chart.destroy();

        chart = null;

    }


    // ========================================================
    // CREATE CHART
    // ========================================================

    chart = new Chart(
        temperatureChart,
        {

            type: "line",


            data: {

                labels: labels,


                datasets: [

                    {

                        label:
                            "Temperature (°C)",


                        data:
                            temperatures,


                        borderWidth: 3,


                        borderColor:
                            "#ff9800",


                        backgroundColor:
                            "rgba(255, 152, 0, 0.2)",


                        fill: true,


                        tension: 0.4,


                        pointRadius: 4,


                        pointHoverRadius: 6

                    }

                ]

            },


            // =================================================
            // CHART OPTIONS
            // =================================================

            options: {

                responsive: true,


                maintainAspectRatio: false,


                interaction: {

                    intersect: false,

                    mode: "index"

                },


                plugins: {

                    legend: {

                        display: true

                    },


                    tooltip: {

                        callbacks: {

                            label: function(context) {

                                return (
                                    ` ${context.parsed.y}°C`
                                );

                            }

                        }

                    }

                },


                scales: {

                    y: {

                        beginAtZero: false,


                        title: {

                            display: true,

                            text:
                                "Temperature (°C)"

                        }

                    },


                    x: {

                        title: {

                            display: true,

                            text:
                                "Time"

                        },


                        ticks: {

                            maxRotation: 45,

                            minRotation: 0,

                            autoSkip: true,

                            maxTicksLimit: 12

                        }

                    }

                }

            }

        }
    );


    console.log(
        "Temperature chart updated successfully."
    );

}