const API_URL = "http://localhost:5000/api/vulnerabilities";

let allVulnerabilities = [];


// ==================================================
// GET TOKEN
// ==================================================

function getToken() {
    return window.localStorage.getItem("token");
}


// ==================================================
// LOAD VULNERABILITIES
// ==================================================

async function loadVulnerabilities() {

    try {

        const token = getToken();

        if (!token) {
            alert("Please login first!");
            window.location.href = "login.html";
            return;
        }

        const response = await fetch(API_URL, {

            method: "GET",

            headers: {
                "Authorization": "Bearer " + token
            }

        });


        const data = await response.json();


        console.log("Vulnerability Data:", data);


        if (!response.ok) {

            console.error(data.message);

            return;

        }


        allVulnerabilities = data.vulnerabilities || [];


        updateCounts(allVulnerabilities);


        displayVulnerabilities(allVulnerabilities);


        loadSecurityScore();


    } catch (error) {

        console.error(
            "Load Vulnerabilities Error:",
            error
        );

    }

}


// ==================================================
// UPDATE COUNTS
// ==================================================

function updateCounts(vulnerabilities) {

    const critical =
        vulnerabilities.filter(
            item => item.severity === "Critical"
        ).length;


    const high =
        vulnerabilities.filter(
            item => item.severity === "High"
        ).length;


    const medium =
        vulnerabilities.filter(
            item => item.severity === "Medium"
        ).length;


    const low =
        vulnerabilities.filter(
            item => item.severity === "Low"
        ).length;


    document.getElementById(
        "criticalCount"
    ).textContent = critical;


    document.getElementById(
        "highCount"
    ).textContent = high;


    document.getElementById(
        "mediumCount"
    ).textContent = medium;


    document.getElementById(
        "lowCount"
    ).textContent = low;

}


// ==================================================
// DISPLAY VULNERABILITIES
// ==================================================

function displayVulnerabilities(vulnerabilities) {

    const table =
        document.getElementById(
            "vulnerabilityTable"
        );


    if (!table) return;


    table.innerHTML = "";


    if (vulnerabilities.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No vulnerabilities found.
                </td>
            </tr>
        `;

        return;

    }


    vulnerabilities.forEach(
        vulnerability => {

            const row =
                document.createElement("tr");


            const severity =
                vulnerability.severity.toLowerCase();


            const status =
                vulnerability.status.toLowerCase();


            row.innerHTML = `

                <td>
                    ${vulnerability.vulnerability}
                </td>

                <td>
                    <span class="badge ${severity}">
                        ${vulnerability.severity}
                    </span>
                </td>

                <td>
                    <span class="badge ${status}">
                        ${vulnerability.status}
                    </span>
                </td>

                <td>
                    ${vulnerability.project}
                </td>

                <td>

                    ${
                        vulnerability.status === "Open"

                        ?

                        `
                        <button
                            class="resolve-btn"
                            onclick="resolveVulnerability('${vulnerability._id}')">

                            ✅ Resolve

                        </button>
                        `

                        :

                        `
                        <span>
                            ✔️ Resolved
                        </span>
                        `
                    }


                    <button
                        class="delete-btn"
                        onclick="deleteVulnerability('${vulnerability._id}')">

                        🗑️ Delete

                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );

}


// ==================================================
// ADD VULNERABILITY
// ==================================================

async function addVulnerability() {

    const project =
        document.getElementById(
            "vulnProject"
        ).value.trim();


    const vulnerability =
        document.getElementById(
            "vulnName"
        ).value.trim();


    const severity =
        document.getElementById(
            "vulnSeverity"
        ).value;


    const file =
        document.getElementById(
            "vulnFile"
        ).value.trim();


    const description =
        document.getElementById(
            "vulnDescription"
        ).value.trim();


    if (!project || !vulnerability) {

        alert(
            "Project and Vulnerability name are required!"
        );

        return;

    }


    const token = getToken();


    if (!token) {

        alert("Please login first!");

        window.location.href =
            "login.html";

        return;

    }


    try {

        const response = await fetch(
            API_URL,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + token

                },

                body: JSON.stringify({

                    project: project,

                    vulnerability:
                        vulnerability,

                    severity: severity,

                    description:
                        description,

                    file: file

                })

            }
        );


        const data =
            await response.json();


        console.log(
            "Add Vulnerability:",
            data
        );


        if (!response.ok) {

            alert(
                data.message ||
                "Vulnerability add failed!"
            );

            return;

        }


        alert(
            "Vulnerability added successfully! 🛡️"
        );


        // Clear form

        document.getElementById(
            "vulnProject"
        ).value = "";


        document.getElementById(
            "vulnName"
        ).value = "";


        document.getElementById(
            "vulnFile"
        ).value = "";


        document.getElementById(
            "vulnDescription"
        ).value = "";


        // Hide form

        const box =
            document.getElementById(
                "addVulnerabilityBox"
            );


        if (box) {

            box.style.display =
                "none";

        }


        // Reload data

        loadVulnerabilities();


    } catch (error) {

        console.error(
            "Add Vulnerability Error:",
            error
        );


        alert(
            "Backend server se connection nahi ho raha!"
        );

    }

}


// ==================================================
// RESOLVE VULNERABILITY
// ==================================================

async function resolveVulnerability(id) {

    const confirmResolve =
        confirm(
            "Are you sure you want to resolve this vulnerability?"
        );


    if (!confirmResolve) {

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

                    body: JSON.stringify({

                        status: "Resolved"

                    })

                }
            );


        const data =
            await response.json();


        if (response.ok) {

            alert(
                "Vulnerability resolved successfully! ✅"
            );


            loadVulnerabilities();


        } else {

            alert(
                data.message ||
                "Unable to resolve vulnerability!"
            );

        }


    } catch (error) {

        console.error(
            "Resolve Vulnerability Error:",
            error
        );


        alert(
            "Backend server se connection nahi ho raha!"
        );

    }

}


// ==================================================
// DELETE VULNERABILITY
// ==================================================

async function deleteVulnerability(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this vulnerability?"
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


        console.log(
            "Delete Response:",
            data
        );


        if (response.ok) {

            alert(
                "Vulnerability deleted successfully! 🗑️"
            );


            loadVulnerabilities();


        } else {

            alert(
                data.message ||
                "Delete failed!"
            );

        }


    } catch (error) {

        console.error(
            "Delete Vulnerability Error:",
            error
        );


        alert(
            "Backend server se connection nahi ho raha!"
        );

    }

}


// ==================================================
// SEARCH + FILTER
// ==================================================

function filterVulnerabilities() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const severityFilter =
        document.getElementById(
            "severityFilter"
        );


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedSeverity =
        severityFilter.value;


    const filtered =
        allVulnerabilities.filter(
            vulnerability => {

                const name =
                    vulnerability.vulnerability
                        .toLowerCase();


                const severity =
                    vulnerability.severity
                        .toLowerCase();


                const matchesSearch =
                    name.includes(
                        searchText
                    );


                const matchesSeverity =
                    selectedSeverity === "all" ||
                    severity === selectedSeverity;


                return (
                    matchesSearch &&
                    matchesSeverity
                );

            }
        );


    displayVulnerabilities(
        filtered
    );

}


// ==================================================
// LOAD SECURITY SCORE
// ==================================================

async function loadSecurityScore() {

    try {

        const response =
            await fetch(
                `${API_URL}/score`,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + getToken()

                    }

                }
            );


        const data =
            await response.json();


        console.log(
            "Security Score:",
            data
        );


        if (!response.ok) {

            console.error(
                data.message
            );

            return;

        }


        const scoreElement =
            document.getElementById(
                "securityScore"
            );


        const levelElement =
            document.getElementById(
                "securityLevel"
            );


        if (scoreElement) {

            scoreElement.textContent =
                data.score + " / 100";

        }


        if (levelElement) {

            levelElement.textContent =
                data.level;

        }


    } catch (error) {

        console.error(
            "Security Score Error:",
            error
        );

    }

}


// ==================================================
// PAGE LOAD
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Load vulnerabilities

        loadVulnerabilities();


        // Search

        const searchInput =
            document.getElementById(
                "searchInput"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                filterVulnerabilities
            );

        }


        // Severity filter

        const severityFilter =
            document.getElementById(
                "severityFilter"
            );


        if (severityFilter) {

            severityFilter.addEventListener(
                "change",
                filterVulnerabilities
            );

        }


        // ==================================================
        // ADD VULNERABILITY BUTTON
        // ==================================================

        const addVulnerabilityBtn =
            document.getElementById(
                "addVulnerabilityBtn"
            );


        const addVulnerabilityBox =
            document.getElementById(
                "addVulnerabilityBox"
            );


        if (addVulnerabilityBtn) {

            addVulnerabilityBtn.addEventListener(
                "click",
                function () {

                    if (
                        addVulnerabilityBox.style.display ===
                        "none" ||
                        addVulnerabilityBox.style.display ===
                        ""
                    ) {

                        addVulnerabilityBox.style.display =
                            "block";

                    } else {

                        addVulnerabilityBox.style.display =
                            "none";

                    }

                }
            );

        }


        // ==================================================
        // SAVE VULNERABILITY BUTTON
        // ==================================================

        const saveVulnerabilityBtn =
            document.getElementById(
                "saveVulnerabilityBtn"
            );


        if (saveVulnerabilityBtn) {

            saveVulnerabilityBtn.addEventListener(
                "click",
                addVulnerability
            );

        }

    }
);