const API_URL = "http://localhost:5000/api";


// ==================================================
// GET TOKEN
// ==================================================

function getToken() {

    return localStorage.getItem("token");

}


// ==================================================
// LOAD VULNERABILITIES
// ==================================================

async function getVulnerabilities() {

    const token = getToken();

    console.log("Token available:", !!token);


    if (!token) {

        alert("Please login first!");

        window.location.href = "login.html";

        return [];

    }


    try {

        const response = await fetch(
            `${API_URL}/vulnerabilities`,
            {
                method: "GET",

                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );


        console.log(
            "Vulnerability API Status:",
            response.status
        );


        const data = await response.json();


        console.log(
            "Vulnerability API Response:",
            data
        );


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to load vulnerabilities!"
            );

            return [];

        }


        if (
            !data.vulnerabilities ||
            data.vulnerabilities.length === 0
        ) {

            console.log(
                "Backend returned 0 vulnerabilities."
            );

            return [];

        }


        return data.vulnerabilities;


    } catch (error) {

        console.error(
            "Vulnerability API Error:",
            error
        );


        alert(
            "Backend server se connection nahi ho raha!"
        );


        return [];

    }

}


// ==================================================
// UPDATE SUMMARY
// ==================================================

function updateSummary(vulnerabilities) {

    let critical = 0;
    let high = 0;
    let medium = 0;
    let low = 0;


    vulnerabilities.forEach(
        vulnerability => {

            if (
                vulnerability.severity ===
                "Critical"
            ) {
                critical++;
            }

            else if (
                vulnerability.severity ===
                "High"
            ) {
                high++;
            }

            else if (
                vulnerability.severity ===
                "Medium"
            ) {
                medium++;
            }

            else if (
                vulnerability.severity ===
                "Low"
            ) {
                low++;
            }

        }
    );


    document.getElementById(
        "criticalIssues"
    ).textContent = critical;


    document.getElementById(
        "highIssues"
    ).textContent = high;


    document.getElementById(
        "mediumIssues"
    ).textContent = medium;


    document.getElementById(
        "lowIssues"
    ).textContent = low;


    return {
        critical,
        high,
        medium,
        low
    };

}


// ==================================================
// CALCULATE RISK SCORE
// ==================================================

function calculateRiskScore(
    vulnerabilities
) {

    let score = 100;


    vulnerabilities.forEach(
        vulnerability => {

            if (
                vulnerability.status ===
                "Resolved"
            ) {

                return;

            }


            if (
                vulnerability.severity ===
                "Critical"
            ) {

                score -= 25;

            }

            else if (
                vulnerability.severity ===
                "High"
            ) {

                score -= 15;

            }

            else if (
                vulnerability.severity ===
                "Medium"
            ) {

                score -= 10;

            }

            else if (
                vulnerability.severity ===
                "Low"
            ) {

                score -= 5;

            }

        }
    );


    if (score < 0) {

        score = 0;

    }


    return score;

}


// ==================================================
// RISK LEVEL
// ==================================================

function getRiskLevel(score) {

    if (score >= 80) {

        return "🟢 Good";

    }

    if (score >= 60) {

        return "🟡 Moderate";

    }

    if (score >= 40) {

        return "🟠 Warning";

    }

    return "🔴 Critical";

}


// ==================================================
// CREATE AI ANALYSIS
// ==================================================

async function createAIAnalysis(
    vulnerability
) {

    try {

        console.log(
            "Sending vulnerability to AI Analysis:",
            vulnerability
        );


        const response = await fetch(
            `${API_URL}/ai-analysis`,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + getToken()

                },

                body: JSON.stringify({

                    vulnerabilityId:
                        vulnerability._id

                })

            }
        );


        const data =
            await response.json();


        console.log(
            "AI Analysis Response:",
            data
        );


        if (!response.ok) {

            alert(
                data.message ||
                "AI analysis failed!"
            );

            return null;

        }


        return data.analysis;


    } catch (error) {

        console.error(
            "AI Analysis Error:",
            error
        );


        return null;

    }

}


// ==================================================
// DISPLAY AI ANALYSIS
// ==================================================

function displayAnalysis(
    analysis
) {

    if (!analysis) {

        return;

    }


    document.getElementById(
        "issueTitle"
    ).textContent =
        analysis.vulnerability;


    document.getElementById(
        "issueSeverity"
    ).textContent =
        analysis.severity;


    document.getElementById(
        "issueDescription"
    ).textContent =
        analysis.impact;


    document.getElementById(
        "aiExplanation"
    ).textContent =
        `Risk Level: ${analysis.risk}. ${analysis.impact}`;


    const recommendationList =
        document.getElementById(
            "recommendationList"
        );


    recommendationList.innerHTML = "";


    const item =
        document.createElement("li");


    item.textContent =
        analysis.recommendation;


    recommendationList.appendChild(
        item
    );

}


// ==================================================
// RUN AI ANALYSIS
// ==================================================

async function runAIAnalysis() {

    console.log(
        "AI Analysis Started"
    );


    const vulnerabilities =
        await getVulnerabilities();


    console.log(
        "Vulnerabilities received:",
        vulnerabilities
    );


    if (
        vulnerabilities.length === 0
    ) {

        alert(
            "No vulnerabilities found!"
        );

        return;

    }


    // Update summary

    const counts =
        updateSummary(
            vulnerabilities
        );


    // Security risk score

    const score =
        calculateRiskScore(
            vulnerabilities
        );


    document.getElementById(
        "riskScore"
    ).textContent =
        score;


    document.getElementById(
        "riskLevel"
    ).textContent =
        getRiskLevel(score);


    // Summary

    document.getElementById(
        "aiSummary"
    ).textContent =
        `Found ${vulnerabilities.length} vulnerability record(s).`;


    // Select open vulnerability

    const vulnerability =
        vulnerabilities.find(
            item =>
                item.status === "Open"
        ) ||
        vulnerabilities[0];


    console.log(
        "Selected vulnerability:",
        vulnerability
    );


    // Create AI analysis

    const analysis =
        await createAIAnalysis(
            vulnerability
        );


    if (!analysis) {

        return;

    }


    // Display result

    displayAnalysis(
        analysis
    );


    document.getElementById(
        "aiSummary"
    ).textContent =
        `AI analysis completed. ${counts.critical} Critical, ${counts.high} High, ${counts.medium} Medium and ${counts.low} Low vulnerabilities detected.`;


    alert(
        "AI Security Analysis completed! 🤖"
    );

}


// ==================================================
// LOGOUT
// ==================================================

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("isLoggedIn");

    localStorage.removeItem("userName");

    localStorage.removeItem("userEmail");

    window.location.href =
        "login.html";

}


// ==================================================
// PAGE LOAD
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const analyzeButton =
            document.getElementById(
                "analyzeBtn"
            );


        if (analyzeButton) {

            analyzeButton.addEventListener(
                "click",
                runAIAnalysis
            );

        }


        const logoutButton =
            document.getElementById(
                "logoutBtn"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    logout();

                }
            );

        }

    }
);