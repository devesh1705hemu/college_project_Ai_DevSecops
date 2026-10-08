// ==================================================
// REPORTS API
// ==================================================

const API_URL = "http://localhost:5000/api/reports";


// ==================================================
// GET TOKEN
// ==================================================

function getToken() {
    return localStorage.getItem("token");
}


// ==================================================
// DOWNLOAD PDF REPORT
// ==================================================

async function downloadPDFReport(button) {

    const token = getToken();

    if (!token) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    const originalText = button.innerText;

    try {

        button.innerText = "⏳ Generating...";
        button.disabled = true;

        const response = await fetch(
            `${API_URL}/download`,
            {
                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {

            let errorMessage = "Report generation failed!";

            try {
                const data = await response.json();

                if (data.message) {
                    errorMessage = data.message;
                }

            } catch (error) {
                console.log("Error reading response:", error);
            }

            throw new Error(errorMessage);
        }


        // Convert response into PDF blob
        const blob = await response.blob();


        // Create temporary download URL
        const url = window.URL.createObjectURL(blob);


        // Create download link
        const link = document.createElement("a");

        link.href = url;

        link.download = "DevSecOps-Security-Report.pdf";

        document.body.appendChild(link);

        link.click();


        // Cleanup
        link.remove();

        window.URL.revokeObjectURL(url);


        button.innerText = "✓ Downloaded";

        alert(
            "Security Report PDF downloaded successfully!"
        );


    } catch (error) {

        console.error(
            "Report Download Error:",
            error
        );

        alert(
            error.message ||
            "Unable to generate report!"
        );

        button.innerText = originalText;

    } finally {

        button.disabled = false;

    }

}


// ==================================================
// GENERATE REPORT BUTTON
// ==================================================

const generateReport =
    document.getElementById("generateReport");


if (generateReport) {

    generateReport.addEventListener(
        "click",
        async function () {

            await downloadPDFReport(
                generateReport
            );

        }
    );

}


// ==================================================
// REPORT CARD DOWNLOAD BUTTONS
// ==================================================

const downloadButtons =
    document.querySelectorAll(
        ".downloadBtn"
    );


downloadButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            async function () {

                await downloadPDFReport(
                    button
                );

            }
        );

    }
);


// ==================================================
// LOGOUT
// ==================================================

const logout =
    document.getElementById("logout");


if (logout) {

    logout.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

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
    );

}