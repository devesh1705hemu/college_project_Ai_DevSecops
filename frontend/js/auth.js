// ==================================================
// REGISTER FUNCTION
// ==================================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value;

        // Check fields
        if (!name || !email || !password) {
            alert("Please fill all fields!");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                // Save basic user information
                localStorage.setItem(
                    "userName",
                    data.user.name
                );

                localStorage.setItem(
                    "userEmail",
                    data.user.email
                );

                alert("Registration Successful!");

                // Go to login page
                window.location.href = "login.html";

            } else {

                alert(
                    data.message ||
                    "Registration failed!"
                );

            }

        } catch (error) {

            console.error("Registration Error:", error);

            alert(
                "Backend server se connection nahi ho raha!"
            );

        }

    });

}


// ==================================================
// LOGIN FUNCTION
// ==================================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        // Check fields
        if (!email || !password) {

            alert("Please enter email and password!");
            return;

        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                // ==========================================
                // SAVE LOGIN INFORMATION
                // ==========================================

                localStorage.setItem(
                    "isLoggedIn",
                    "true"
                );

                localStorage.setItem(
                    "userName",
                    data.user.name
                );

                localStorage.setItem(
                    "userEmail",
                    data.user.email
                );

                // ==========================================
                // SAVE JWT TOKEN
                // ==========================================

                localStorage.setItem(
                    "token",
                    data.token
                );

                alert("Login Successful!");

                // Go to dashboard
                window.location.href = "dashboard.html";

            } else {

                alert(
                    data.message ||
                    "Invalid email or password!"
                );

            }

        } catch (error) {

            console.error("Login Error:", error);

            alert(
                "Backend server se connection nahi ho raha!"
            );

        }

    });

}