console.log("DevSecOps Dashboard Loaded Successfully!");


// ==================================================
// API
// ==================================================

const API_BASE = "http://localhost:5000/api";


// ==================================================
// TOKEN
// ==================================================

function getToken() {

    return localStorage.getItem("token");

}


// ==================================================
// AUTH HEADER
// ==================================================

function getHeaders() {

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    };

}


// ==================================================
// USER NAME
// ==================================================

const userName =
    localStorage.getItem("userName");

const userNameElement =
    document.getElementById("userName");


if (userName && userNameElement) {

    userNameElement.innerText =
        userName;

}


// ==================================================
// TIME AGO
// ==================================================

function timeAgo(date) {

    if (!date) {
        return "Recently";
    }

    const now = new Date();

    const past = new Date(date);

    const seconds =
        Math.floor((now - past) / 1000);


    if (seconds < 60) {

        return "Just now";

    }


    const minutes =
        Math.floor(seconds / 60);


    if (minutes < 60) {

        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

    }


    const hours =
        Math.floor(minutes / 60);


    if (hours < 24) {

        return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    }


    const days =
        Math.floor(hours / 24);


    return `${days} day${days > 1 ? "s" : ""} ago`;

}


// ==================================================
// SECURITY DATA
// ==================================================

async function loadSecurityData() {

    try {

        const response = await fetch(
            `${API_BASE}/vulnerabilities`,
            {
                headers: getHeaders()
            }
        );


        if (!response.ok) {

            throw new Error(
                "Unable to load vulnerabilities"
            );

        }


        const data =
            await response.json();


        const vulnerabilities =
            Array.isArray(data)
                ? data
                : data.vulnerabilities || [];


        // Only OPEN vulnerabilities
        const openVulnerabilities =
            vulnerabilities.filter(
                vulnerability =>
                    vulnerability.status !== "Resolved"
            );


        const criticalCount =
            openVulnerabilities.filter(
                vulnerability =>
                    vulnerability.severity === "Critical"
            ).length;


        const highCount =
            openVulnerabilities.filter(
                vulnerability =>
                    vulnerability.severity === "High"
            ).length;


        const mediumCount =
            openVulnerabilities.filter(
                vulnerability =>
                    vulnerability.severity === "Medium"
            ).length;


        const lowCount =
            openVulnerabilities.filter(
                vulnerability =>
                    vulnerability.severity === "Low"
            ).length;


        // Same scoring formula as vulnerability system
        let score = 100;


        score -= criticalCount * 25;

        score -= highCount * 15;

        score -= mediumCount * 10;

        score -= lowCount * 5;


        if (score < 0) {

            score = 0;

        }


        // Update score
        const scoreElement =
            document.getElementById(
                "securityScore"
            );


        if (scoreElement) {

            scoreElement.innerText =
                `${score}/100`;

        }


        // Update critical
        const criticalElement =
            document.getElementById(
                "criticalIssues"
            );


        if (criticalElement) {

            criticalElement.innerText =
                criticalCount;

        }


        // Update high
        const highElement =
            document.getElementById(
                "highIssues"
            );


        if (highElement) {

            highElement.innerText =
                highCount;

        }


        // Update progress
        const progress =
            document.getElementById(
                "securityProgress"
            );


        if (progress) {

            progress.style.width =
                `${score}%`;

            progress.innerText =
                `${score}%`;

        }


        // Security status
        const securityStatus =
            document.getElementById(
                "securityStatus"
            );


        if (securityStatus) {

            if (score >= 80) {

                securityStatus.innerText =
                    "🟢 Secure";

            } else if (score >= 60) {

                securityStatus.innerText =
                    "🟡 Moderate";

            } else if (score >= 40) {

                securityStatus.innerText =
                    "🟠 Warning";

            } else {

                securityStatus.innerText =
                    "🔴 Critical";

            }

        }


        return vulnerabilities;

    } catch (error) {

        console.error(
            "Security Data Error:",
            error
        );

        return [];

    }

}


// ==================================================
// PIPELINE DATA
// ==================================================

async function loadPipelineData() {

    try {

        const response =
            await fetch(
                `${API_BASE}/pipelines`,
                {
                    headers: getHeaders()
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load pipelines"
            );

        }


        const data =
            await response.json();


        const pipelines =
            Array.isArray(data)
                ? data
                : data.pipelines || [];


        if (pipelines.length === 0) {

            document.getElementById(
                "pipelineStatus"
            ).innerText = "No Pipeline";

            document.getElementById(
                "pipelineMessage"
            ).innerText =
                "No builds available";

            return [];

        }


        // Latest pipeline
        const latestPipeline =
            [...pipelines].sort(
                (a, b) =>
                    new Date(
                        b.createdAt || b.startTime
                    ) -
                    new Date(
                        a.createdAt || a.startTime
                    )
            )[0];


        const status =
            latestPipeline.status;


        const pipelineStatus =
            document.getElementById(
                "pipelineStatus"
            );


        const pipelineMessage =
            document.getElementById(
                "pipelineMessage"
            );


        if (status === "Success") {

            pipelineStatus.innerText =
                "✓ Passed";

            pipelineMessage.innerText =
                "Last Build: Successful";

        } else if (status === "Failed") {

            pipelineStatus.innerText =
                "✕ Failed";

            pipelineMessage.innerText =
                "Last Build: Failed";

        } else if (status === "Running") {

            pipelineStatus.innerText =
                "⏳ Running";

            pipelineMessage.innerText =
                "Build is currently running";

        } else {

            pipelineStatus.innerText =
                "⏸ Pending";

            pipelineMessage.innerText =
                "Build is pending";

        }


        return pipelines;

    } catch (error) {

        console.error(
            "Pipeline Data Error:",
            error
        );

        return [];

    }

}


// ==================================================
// MONITORING DATA
// ==================================================

async function loadMonitoringData() {

    try {

        const response =
            await fetch(
                `${API_BASE}/monitoring`,
                {
                    headers: getHeaders()
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load monitoring"
            );

        }


        const data =
            await response.json();


        return Array.isArray(data)
            ? data
            : data.monitoring || [];

    } catch (error) {

        console.error(
            "Monitoring Data Error:",
            error
        );

        return [];

    }

}


// ==================================================
// AI ANALYSIS DATA
// ==================================================

async function loadAIAnalysisData() {

    try {

        const response =
            await fetch(
                `${API_BASE}/ai-analysis`,
                {
                    headers: getHeaders()
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load AI analysis"
            );

        }


        const data =
            await response.json();


        return Array.isArray(data)
            ? data
            : data.analyses || [];

    } catch (error) {

        console.error(
            "AI Analysis Error:",
            error
        );

        return [];

    }

}


// ==================================================
// RECENT ACTIVITY
// ==================================================

async function loadRecentActivity(
    pipelines,
    vulnerabilities,
    aiAnalyses,
    monitoring
) {

    const activityContainer =
        document.getElementById(
            "recentActivity"
        );


    if (!activityContainer) {
        return;
    }


    const activities = [];


    // Pipeline activities
    pipelines.forEach(
        pipeline => {

            activities.push({

                icon:
                    pipeline.status === "Success"
                        ? "🟢"
                        : pipeline.status === "Failed"
                            ? "🔴"
                            : "⏳",

                text:
                    `Pipeline ${pipeline.project || "Build"} - ${pipeline.status}`,

                date:
                    pipeline.updatedAt ||
                    pipeline.createdAt ||
                    pipeline.startTime

            });

        }
    );


    // Vulnerability activities
    vulnerabilities.forEach(
        vulnerability => {

            activities.push({

                icon:
                    vulnerability.severity === "Critical"
                        ? "🔴"
                        : vulnerability.severity === "High"
                            ? "⚠️"
                            : "🛡️",

                text:
                    `${vulnerability.severity} severity vulnerability: ${vulnerability.vulnerability}`,

                date:
                    vulnerability.detectedAt ||
                    vulnerability.createdAt

            });

        }
    );


    // AI activities
    aiAnalyses.forEach(
        analysis => {

            activities.push({

                icon: "🤖",

                text:
                    `AI security analysis: ${analysis.vulnerability}`,

                date:
                    analysis.analyzedAt ||
                    analysis.createdAt

            });

        }
    );


    // Monitoring activities
    monitoring.forEach(
        service => {

            activities.push({

                icon:
                    service.status === "Online"
                        ? "☁️"
                        : service.status === "Warning"
                            ? "⚠️"
                            : "🔴",

                text:
                    `Cloud service ${service.service}: ${service.status}`,

                date:
                    service.lastChecked ||
                    service.updatedAt

            });

        }
    );


    // Sort newest first
    activities.sort(
        (a, b) =>
            new Date(b.date || 0) -
            new Date(a.date || 0)
    );


    // Only show latest 5
    const latestActivities =
        activities.slice(0, 5);


    if (latestActivities.length === 0) {

        activityContainer.innerHTML = `
            <div class="activity">
                <span>📋</span>
                No recent activity available.
            </div>
        `;

        return;

    }


    activityContainer.innerHTML =
        latestActivities.map(
            activity => `
                <div class="activity">

                    <span>
                        ${activity.icon}
                    </span>

                    ${activity.text}

                    <small>
                        ${timeAgo(activity.date)}
                    </small>

                </div>
            `
        ).join("");

}


// ==================================================
// LOAD DASHBOARD
// ==================================================

async function loadDashboard() {

    const token = getToken();


    if (!token) {

        alert("Please login first!");

        window.location.href =
            "login.html";

        return;

    }


    const [
        vulnerabilities,
        pipelines,
        aiAnalyses,
        monitoring
    ] = await Promise.all([

        loadSecurityData(),

        loadPipelineData(),

        loadAIAnalysisData(),

        loadMonitoringData()

    ]);


    await loadRecentActivity(

        pipelines,

        vulnerabilities,

        aiAnalyses,

        monitoring

    );

}


// ==================================================
// LOGOUT
// ==================================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            localStorage.removeItem(
                "isLoggedIn"
            );

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "userName"
            );

            localStorage.removeItem(
                "userEmail"
            );


            alert(
                "Logged Out Successfully!"
            );


            window.location.href =
                "login.html";

        }
    );

}


// ==================================================
// START DASHBOARD
// ==================================================

loadDashboard();