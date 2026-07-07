function updateWeatherAlerts(data)
{

    alertsContainer.innerHTML = "";

    const alerts = data.alerts.alert;

    if(alerts.length === 0)
    {

        alertsContainer.innerHTML = `
            <div class="alertCard safe">

                <h3>✅ No Weather Alerts</h3>

                <p>No warnings for this location.</p>

            </div>
        `;

        return;

    }

    alerts.forEach(alert=>{

        const card=document.createElement("div");

        card.className="alertCard danger";

        card.innerHTML=`

            <h3>${alert.headline}</h3>

            <p>${alert.desc}</p>

            <small>

                Effective:

                ${alert.effective}

            </small>

        `;

        alertsContainer.appendChild(card);

    });

}