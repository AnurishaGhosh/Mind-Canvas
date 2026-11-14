
let isSignup = false;

function login() {

    let Name = document.getElementById("Name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let Gender = document.getElementById("Gender").value;

    if (isSignup) {

        fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: Name,
                email: email,
                password: password,
                gender: Gender
            })
        })

        .then(res => res.json())

        .then(data => {

            alert(data.message);

            if (data.success) {

                isSignup = false;

                document.getElementById("Name").style.display = "none";
                document.getElementById("Gender").style.display = "none";

                document.getElementById("actionBtn").innerHTML = "Login";

                document.getElementById("switch").innerHTML =
                "Don't have an account? Sign Up";
            }
            else {

                alert(data.message);

            }

        });

    }

    else {

        fetch("/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })

        })

        .then(res => res.json())

        .then(data => {

            if (data.success) {

                localStorage.setItem("name", data.name);
                localStorage.setItem("gender", data.gender);
                localStorage.setItem("email", data.email);

                window.location.href = "/dashboard";

            }

            else {

                alert(data.message);

            }

        });

    }

}

function signupMode() {

    isSignup = true;

    document.getElementById("Name").style.display = "block";
    document.getElementById("Gender").style.display = "block";

    document.getElementById("actionBtn").innerHTML =
    "Create new Account";

     document.getElementById("switch").innerHTML =
    'Already have an account? <a href="/">Log in</a>';

}