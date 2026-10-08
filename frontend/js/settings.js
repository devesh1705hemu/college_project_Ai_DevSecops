const saveSettings =
    document.getElementById("saveSettings");

const darkMode =
    document.getElementById("darkMode");

const fullName =
    document.getElementById("fullName");

const email =
    document.getElementById("email");


saveSettings.addEventListener("click", function () {

    if (fullName.value === "" || email.value === "") {

        alert("Please enter your name and email!");

        return;

    }


    localStorage.setItem(
        "userName",
        fullName.value
    );


    localStorage.setItem(
        "userEmail",
        email.value
    );


    alert("Settings Saved Successfully!");


});


darkMode.addEventListener("change", function () {

    if (darkMode.checked) {

        document.body.style.background =
            "#0f172a";

        document.body.style.color =
            "white";

    }

    else {

        document.body.style.background =
            "white";

        document.body.style.color =
            "black";

    }

});

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener("click", function (event) {

        event.preventDefault();


        localStorage.removeItem("isLoggedIn");


        alert("Logged Out Successfully!");

        window.location.href = "index.html";

    });

}

const savedName =
    localStorage.getItem("userName");

const savedEmail =
    localStorage.getItem("userEmail");


if (savedName) {

    fullName.value =
        savedName;

}


if (savedEmail) {

    email.value =
        savedEmail;

}