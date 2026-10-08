const API_URL =
    "http://localhost:5000/api/monitoring";


// ==================================================
// GET TOKEN
// ==================================================

function getToken() {

    return localStorage.getItem("token");

}


// ==================================================
// LOAD MONITORING DATA
// ==================================================

async function loadMonitoringData() {

    const token = getToken();

    if (!token) {

        alert("Please login first!");

        window.location.href =
            "login.html";

        return;

    }


    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        const data =
            await response.json();


        console.log(
            "Monitoring Data:",
            data
        );


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to load monitoring data!"
            );

            return;

        }


        displayMonitoringData(
            data.monitoring
        );


    } catch (error) {

        console.error(
            "Monitoring Error:",
            error
        );

        alert(
            "Backend server se connection nahi ho raha!"
        );

    }

}


// ==================================================
// DISPLAY MONITORING DATA
// ==================================================

function displayMonitoringData(
    monitoring
) {

    const container =
        document.getElementById(
            "monitoringList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !monitoring ||
        monitoring.length === 0
    ) {

        container.innerHTML = `
            <p>
                No monitoring services found.
            </p>
        `;

        return;

    }


    monitoring.forEach(
        service => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "monitor-card";


            card.innerHTML = `

                <h3>
                    ☁️ ${service.service}
                </h3>

                <p>
                    <strong>Status:</strong>
                    ${service.status}
                </p>

                <p>
                    <strong>Uptime:</strong>
                    ${service.uptime}%
                </p>

                <p>
                    <strong>Response Time:</strong>
                    ${service.responseTime} ms
                </p>

                <p>
                    <strong>Last Checked:</strong>
                    ${new Date(
                        service.lastChecked
                    ).toLocaleString()}
                </p>

                <button
                    onclick="updateService('${service._id}')"
                >
                    ✏️ Update
                </button>

                <button
                    onclick="deleteService('${service._id}')"
                >
                    🗑️ Delete
                </button>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// ==================================================
// ADD MONITORING SERVICE
// ==================================================

async function addService() {

    const service =
        document.getElementById(
            "serviceName"
        ).value.trim();


    const status =
        document.getElementById(
            "serviceStatus"
        ).value;


    const uptime =
        Number(
            document.getElementById(
                "serviceUptime"
            ).value
        );


    const responseTime =
        Number(
            document.getElementById(
                "serviceResponseTime"
            ).value
        );


    if (!service) {

        alert(
            "Please enter service name!"
        );

        return;

    }


    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + getToken()

                    },

                    body:
                        JSON.stringify({

                            service:
                                service,

                            status:
                                status,

                            uptime:
                                uptime,

                            responseTime:
                                responseTime

                        })

                }
            );


        const data =
            await response.json();


        console.log(
            "Create Monitoring:",
            data
        );


        if (!response.ok) {

            alert(
                data.message ||
                "Service creation failed!"
            );

            return;

        }


        alert(
            "Monitoring service added successfully! ☁️"
        );


        document.getElementById(
            "serviceName"
        ).value = "";


        document.getElementById(
            "addServiceBox"
        ).style.display = "none";


        loadMonitoringData();


    } catch (error) {

        console.error(
            "Add Service Error:",
            error
        );

        alert(
            "Backend server se connection nahi ho raha!"
        );

    }

}


// ==================================================
// UPDATE MONITORING SERVICE
// ==================================================

async function updateService(id) {

    const status =
        prompt(
            "Enter status: Online, Warning or Offline"
        );


    if (!status) {
        return;
    }


    if (
        status !== "Online" &&
        status !== "Warning" &&
        status !== "Offline"
    ) {

        alert(
            "Please enter only Online, Warning or Offline!"
        );

        return;

    }


    const uptime =
        prompt(
            "Enter uptime percentage:",
            "99.9"
        );


    const responseTime =
        prompt(
            "Enter response time in milliseconds:",
            "120"
        );


    if (
        uptime === null ||
        responseTime === null
    ) {

        return;

    }


    if (
        uptime === "" ||
        responseTime === ""
    ) {

        alert(
            "Please enter valid values!"
        );

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + getToken()

                    },

                    body:
                        JSON.stringify({

                            status:
                                status,

                            uptime:
                                Number(uptime),

                            responseTime:
                                Number(responseTime)

                        })

                }
            );


        const data =
            await response.json();


        console.log(
            "Update Monitoring:",
            data
        );


        if (!response.ok) {

            alert(
                data.message ||
                "Update failed!"
            );

            return;

        }


        alert(
            "Monitoring service updated successfully! ✅"
        );


        loadMonitoringData();


    } catch (error) {

        console.error(
            "Update Service Error:",
            error
        );


        alert(
            "Backend server se connection nahi ho raha!"
        );

    }

}


// ==================================================
// DELETE SERVICE
// ==================================================

async function deleteService(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this service?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE",

                    headers: {

                        "Authorization":
                            "Bearer " + getToken()

                    }
                }
            );


        const data =
            await response.json();


        if (response.ok) {

            alert(
                "Monitoring service deleted successfully! 🗑️"
            );

            loadMonitoringData();

        } else {

            alert(
                data.message ||
                "Delete failed!"
            );

        }


    } catch (error) {

        console.error(
            "Delete Service Error:",
            error
        );

        alert(
            "Backend server se connection nahi ho raha!"
        );

    }

}


// ==================================================
// LOGOUT
// ==================================================

function logout() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "isLoggedIn"
    );

    localStorage.removeItem(
        "userName"
    );

    localStorage.removeItem(
        "userEmail"
    );


    window.location.href =
        "login.html";

}


// ==================================================
// PAGE LOAD
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadMonitoringData();


        // ------------------------------------------
        // ADD SERVICE BUTTON
        // ------------------------------------------

        const addServiceBtn =
            document.getElementById(
                "addServiceBtn"
            );


        const addServiceBox =
            document.getElementById(
                "addServiceBox"
            );


        if (addServiceBtn) {

            addServiceBtn.addEventListener(
                "click",
                function () {

                    if (
                        addServiceBox.style.display ===
                        "none"
                    ) {

                        addServiceBox.style.display =
                            "block";

                    } else {

                        addServiceBox.style.display =
                            "none";

                    }

                }
            );

        }


        // ------------------------------------------
        // SAVE SERVICE BUTTON
        // ------------------------------------------

        const saveServiceBtn =
            document.getElementById(
                "saveServiceBtn"
            );


        if (saveServiceBtn) {

            saveServiceBtn.addEventListener(
                "click",
                addService
            );

        }


        // ------------------------------------------
        // REFRESH BUTTON
        // ------------------------------------------

        const refreshBtn =
            document.getElementById(
                "refreshBtn"
            );


        if (refreshBtn) {

            refreshBtn.addEventListener(
                "click",
                loadMonitoringData
            );

        }


        // ------------------------------------------
        // LOGOUT BUTTON
        // ------------------------------------------

        const logoutBtn =
            document.getElementById(
                "logoutBtn"
            );


        if (logoutBtn) {

            logoutBtn.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    logout();

                }
            );

        }

    }
);