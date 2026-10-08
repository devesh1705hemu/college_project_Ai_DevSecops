// ==================================================
// PIPELINE API
// ==================================================

const API_URL = "http://localhost:5000/api/pipelines";


// ==================================================
// GET TOKEN
// ==================================================

function getToken() {
    return window.localStorage.getItem("token");
}


// ==================================================
// LOAD PIPELINES
// ==================================================

async function loadPipelines() {

    try {

        const response = await fetch(API_URL, {
            method: "GET",

            headers: {
                "Authorization": "Bearer " + getToken()
            }
        });

        const data = await response.json();

        console.log("Pipeline Data:", data);

        if (!response.ok) {
            console.error(data.message);
            return;
        }

        displayPipelines(data.pipelines);

    } catch (error) {

        console.error(
            "Load Pipelines Error:",
            error
        );

    }
}


// ==================================================
// DISPLAY PIPELINES
// ==================================================

function displayPipelines(pipelines) {

    const container =
        document.getElementById("pipelineList");

    if (!container) {
        return;
    }

    container.innerHTML = "";


    if (pipelines.length === 0) {

        container.innerHTML = `
            <p>No pipelines found.</p>
        `;

        return;
    }


    // Latest pipeline
    const latestPipeline = pipelines[0];


    // ==================================================
    // UPDATE TOP CARDS
    // ==================================================

    const pipelineId =
        document.getElementById("pipelineId");

    const pipelineBranch =
        document.getElementById("pipelineBranch");

    const pipelineCommit =
        document.getElementById("pipelineCommit");

    const pipelineStatus =
        document.getElementById("pipelineStatus");


    if (pipelineId) {

        pipelineId.textContent =
            "#" + latestPipeline._id.slice(-6);

    }


    if (pipelineBranch) {

        pipelineBranch.textContent =
            latestPipeline.branch;

    }


    if (pipelineCommit) {

        pipelineCommit.textContent =
            latestPipeline.commitId || "N/A";

    }


    if (pipelineStatus) {

        pipelineStatus.textContent =
            latestPipeline.status;

    }


    // ==================================================
    // DISPLAY ALL PIPELINES
    // ==================================================

    pipelines.forEach(pipeline => {

        const card =
            document.createElement("div");

        card.className =
            "pipeline-card";


        card.innerHTML = `

            <h3>
                🚀 ${pipeline.project}
            </h3>

            <p>
                <strong>Branch:</strong>
                ${pipeline.branch}
            </p>

            <p>
                <strong>Status:</strong>
                ${pipeline.status}
            </p>

            <p>
                <strong>Commit:</strong>
                ${pipeline.commitId || "N/A"}
            </p>

            <p>
                <strong>Triggered By:</strong>
                ${pipeline.triggeredBy}
            </p>

            <p>
                <strong>Duration:</strong>
                ${pipeline.duration || "N/A"}
            </p>

            <button
                onclick="deletePipeline('${pipeline._id}')">
                🗑️ Delete
            </button>

        `;


        container.appendChild(card);

    });

}


// ==================================================
// UPDATE PIPELINE STATUS
// ==================================================

async function updatePipelineStatus(
    pipelineId,
    status,
    duration = ""
) {

    try {

        const response = await fetch(
            `${API_URL}/${pipelineId}`,
            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + getToken()

                },

                body: JSON.stringify({

                    status: status,

                    ...(duration
                        ? { duration: duration }
                        : {}),

                    ...(status === "Success" ||
                    status === "Failed"
                        ? {
                            endTime:
                                new Date().toISOString()
                        }
                        : {})

                })

            }
        );


        const data =
            await response.json();


        console.log(
            "Pipeline Status Updated:",
            data
        );


        if (!response.ok) {

            console.error(
                data.message ||
                "Status update failed"
            );

            return false;

        }


        return true;


    } catch (error) {

        console.error(
            "Update Pipeline Status Error:",
            error
        );

        return false;

    }

}


// ==================================================
// SIMULATE PIPELINE EXECUTION
// ==================================================

async function simulatePipeline(
    pipelineId
) {

    const startTime =
        Date.now();


    // --------------------------------------------------
    // STEP 1 - RUNNING
    // --------------------------------------------------

    await updatePipelineStatus(
        pipelineId,
        "Running"
    );

    await loadPipelines();


    // --------------------------------------------------
    // STEP 2 - BUILD
    // --------------------------------------------------

    await new Promise(
        resolve =>
            setTimeout(resolve, 1500)
    );


    // --------------------------------------------------
    // STEP 3 - UNIT TESTING
    // --------------------------------------------------

    await new Promise(
        resolve =>
            setTimeout(resolve, 1500)
    );


    // --------------------------------------------------
    // STEP 4 - SECURITY SCAN
    // --------------------------------------------------

    await new Promise(
        resolve =>
            setTimeout(resolve, 1500)
    );


    // --------------------------------------------------
    // STEP 5 - DOCKER SCAN
    // --------------------------------------------------

    await new Promise(
        resolve =>
            setTimeout(resolve, 1500)
    );


    // --------------------------------------------------
    // STEP 6 - DEPLOYMENT
    // --------------------------------------------------

    await new Promise(
        resolve =>
            setTimeout(resolve, 1500)
    );


    // --------------------------------------------------
    // FINAL STATUS
    // --------------------------------------------------

    const totalSeconds =
        Math.round(
            (Date.now() - startTime) / 1000
        );


    await updatePipelineStatus(
        pipelineId,
        "Success",
        totalSeconds + "s"
    );


    // Reload pipeline from MongoDB
    await loadPipelines();


    alert(
        "Pipeline completed successfully! ✅"
    );

}


// ==================================================
// RUN / CREATE PIPELINE
// ==================================================

async function runPipeline() {

    const token =
        getToken();


    if (!token) {

        alert(
            "Please login first!"
        );

        window.location.href =
            "login.html";

        return;
    }


    const runButton =
        document.getElementById(
            "runPipeline"
        );


    // Prevent double click
    if (runButton) {

        runButton.disabled = true;

        runButton.innerText =
            "⏳ Running Pipeline...";

    }


    const commitId =
        "commit-" + Date.now();


    try {

        // ==================================================
        // CREATE PIPELINE
        // ==================================================

        const response =
            await fetch(
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

                        project:
                            "AI DevSecOps",

                        branch:
                            "main",

                        commitId:
                            commitId,

                        triggeredBy:
                            "Manual"

                    })

                }
            );


        const data =
            await response.json();


        console.log(
            "Created Pipeline:",
            data
        );


        if (!response.ok) {

            alert(
                data.message ||
                "Pipeline creation failed!"
            );

            if (runButton) {

                runButton.disabled =
                    false;

                runButton.innerText =
                    "▶ Run Pipeline";

            }

            return;
        }


        // ==================================================
        // GET CREATED PIPELINE ID
        // ==================================================

        const pipelineId =
            data.pipeline?._id;


        if (!pipelineId) {

            console.error(
                "Pipeline ID not found:",
                data
            );

            alert(
                "Pipeline created but ID nahi mila!"
            );

            if (runButton) {

                runButton.disabled =
                    false;

                runButton.innerText =
                    "▶ Run Pipeline";

            }

            return;
        }


        // ==================================================
        // SHOW PENDING
        // ==================================================

        await loadPipelines();


        // ==================================================
        // START PIPELINE
        // ==================================================

        await simulatePipeline(
            pipelineId
        );


    } catch (error) {

        console.error(
            "Run Pipeline Error:",
            error
        );


        alert(
            "Backend server se connection nahi ho raha!"
        );

    }


    // ==================================================
    // RESET BUTTON
    // ==================================================

    if (runButton) {

        runButton.disabled =
            false;

        runButton.innerText =
            "▶ Run Pipeline";

    }

}


// ==================================================
// DELETE PIPELINE
// ==================================================

async function deletePipeline(
    id
) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this pipeline?"
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
                "Pipeline deleted successfully!"
            );

            loadPipelines();

        } else {

            alert(
                data.message ||
                "Delete failed!"
            );

        }

    } catch (error) {

        console.error(
            "Delete Pipeline Error:",
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

        // Load existing pipelines
        loadPipelines();


        // Run Pipeline button
        const runButton =
            document.getElementById(
                "runPipeline"
            );


        if (runButton) {

            runButton.addEventListener(
                "click",
                runPipeline
            );

        }

    }
);