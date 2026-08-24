// ============================================================
// ALERTS.JS
// Weather Alerts Management
// ============================================================


// ============================================================
// UPDATE WEATHER ALERTS
// ============================================================

function updateWeatherAlerts(data) {

    // --------------------------------------------------------
    // Get alerts container
    // --------------------------------------------------------

    const container =
        document.getElementById("alertsContainer");


    // --------------------------------------------------------
    // Safety check
    // --------------------------------------------------------

    if (!container) {

        console.error(
            "alertsContainer element not found!"
        );

        return;

    }


    // --------------------------------------------------------
    // Clear previous alerts
    // --------------------------------------------------------

    container.innerHTML = "";


    // --------------------------------------------------------
    // Check whether alert data exists
    // --------------------------------------------------------

    if (
        !data ||
        !data.alerts ||
        !Array.isArray(data.alerts.alert)
    ) {

        showNoAlerts(container);

        return;

    }


    // --------------------------------------------------------
    // Get alerts
    // --------------------------------------------------------

    const alerts =
        data.alerts.alert;


    // --------------------------------------------------------
    // No alerts
    // --------------------------------------------------------

    if (alerts.length === 0) {

        showNoAlerts(container);

        return;

    }


    // ========================================================
    // DISPLAY EACH ALERT
    // ========================================================

    alerts.forEach((alert) => {

        const card =
            document.createElement("div");


        card.className =
            "alertCard danger";


        // ----------------------------------------------------
        // Alert information
        // ----------------------------------------------------

        const headline =
            alert.headline ||
            "Weather Alert";


        const description =
            alert.desc ||
            "Weather warning information is available.";


        const effective =
            alert.effective ||
            "Not available";


        const expires =
            alert.expires ||
            "Not available";


        const severity =
            alert.severity ||
            "Unknown";


        const urgency =
            alert.urgency ||
            "Unknown";


        const areas =
            alert.areas ||
            "Not specified";


        // ----------------------------------------------------
        // Create alert card
        // ----------------------------------------------------

        card.innerHTML = `

            <div class="alertHeader">

                <span class="alertIcon">
                    ⚠️
                </span>

                <h3>
                    ${escapeAlertHTML(headline)}
                </h3>

            </div>


            <div class="alertContent">

                <p>
                    ${escapeAlertHTML(description)}
                </p>


                <div class="alertDetails">

                    <div>
                        <strong>
                            Effective:
                        </strong>

                        <span>
                            ${escapeAlertHTML(effective)}
                        </span>
                    </div>


                    <div>
                        <strong>
                            Expires:
                        </strong>

                        <span>
                            ${escapeAlertHTML(expires)}
                        </span>
                    </div>


                    <div>
                        <strong>
                            Severity:
                        </strong>

                        <span>
                            ${escapeAlertHTML(severity)}
                        </span>
                    </div>


                    <div>
                        <strong>
                            Urgency:
                        </strong>

                        <span>
                            ${escapeAlertHTML(urgency)}
                        </span>
                    </div>


                    <div>
                        <strong>
                            Area:
                        </strong>

                        <span>
                            ${escapeAlertHTML(areas)}
                        </span>
                    </div>

                </div>

            </div>

        `;


        // ----------------------------------------------------
        // Add alert card to page
        // ----------------------------------------------------

        container.appendChild(card);

    });

}



// ============================================================
// NO ALERTS MESSAGE
// ============================================================

function showNoAlerts(container) {

    container.innerHTML = `

        <div class="alertCard safe">

            <div class="alertHeader">

                <span class="alertIcon">
                    ✅
                </span>

                <h3>
                    No Weather Alerts
                </h3>

            </div>


            <div class="alertContent">

                <p>
                    No weather warnings are currently
                    available for this location.
                </p>

            </div>

        </div>

    `;

}



// ============================================================
// ESCAPE HTML
// ============================================================

/*
 * Prevents weather alert text coming from the API
 * from being interpreted as HTML.
 */

function escapeAlertHTML(value) {

    if (value === null || value === undefined) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}