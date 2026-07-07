// ===============================
// WEATHER MAP
// ===============================

let map;
let marker;
let circle;

function updateWeatherMap(data)
{
    const latitude = data.location.lat;
    const longitude = data.location.lon;

    if (!map)
    {
        map = L.map("weatherMap").setView(
            [latitude, longitude],
            10
        );

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    "&copy; OpenStreetMap contributors"
            }
        ).addTo(map);
    }
    else
    {
        map.setView([latitude, longitude], 10);
    }

    // Remove previous marker
    if (marker)
    {
        map.removeLayer(marker);
    }

    marker = L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(`
            <b>${data.location.name}</b><br>
            🌡 ${data.current.temp_c}°C<br>
            ${data.current.condition.text}
        `)
        .openPopup();

    // Remove previous circle
    if (circle)
    {
        map.removeLayer(circle);
    }

    circle = L.circle([latitude, longitude], {

        radius: 5000,

        color: "#2196f3",

        fillColor: "#64b5f6",

        fillOpacity: 0.3

    }).addTo(map);
}