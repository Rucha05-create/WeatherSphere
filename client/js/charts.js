let chart;

function updateTemperatureChart(data) {

    const labels = data.forecast.forecastday[0].hour.map(hour =>
        formatHour(hour.time)
    );

    const temperatures = data.forecast.forecastday[0].hour.map(hour =>
        hour.temp_c
    );

    if (chart) {

        chart.destroy();

    }

    chart = new Chart(temperatureChart, {

        type: "line",

        data: {

            labels,

            datasets: [{

                label: "Temperature (°C)",

                data: temperatures,

                borderWidth: 3,

                borderColor: "#ff9800",

                backgroundColor: "rgba(255,152,0,0.2)",

                fill: true,

                tension: 0.4,

                pointRadius: 4,

                pointHoverRadius: 6

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: true

                },

                tooltip: {

                    callbacks: {

                        label: function (context) {

                            return `${context.parsed.y}°C`;

                        }

                    }

                }

            },

            scales: {

                y: {

                    beginAtZero: false,

                    title: {

                        display: true,

                        text: "Temperature (°C)"

                    }

                },

                x: {

                    title: {

                        display: true,

                        text: "Time"

                    }

                }

            }

        }

    });

}