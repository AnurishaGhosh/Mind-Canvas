window.onload = function () {

    // ==========================
    // Display Current Date
    // ==========================
    showCurrentDate();


    // ==========================
    // Display User Name
    // ==========================
    let userName = localStorage.getItem("name");
    let nameElement = document.getElementById("userName");

    if (nameElement && userName) {
        nameElement.innerText = userName;
    }


    // ==========================
    // Change Profile Image
    // ==========================
    let gender = localStorage.getItem("gender");
    let profileImage = document.getElementById("profilePic");

    if (profileImage) {

        if (gender === "Male") {
            profileImage.src = "../static/male.png";
        }
        else if (gender === "Female") {
            profileImage.src = "../static/female.png";
        }

    }


    // ==========================
    // Profile Settings
    // ==========================
    const nameInput = document.querySelector('input[type="text"]');
    const emailInput = document.querySelector('input[type="email"]');
    const profileBtn = document.querySelector(".card button");

    if (nameInput && emailInput) {

        nameInput.value = localStorage.getItem("name") || "";
        emailInput.value = localStorage.getItem("email") || "";

    }

    if (profileBtn) {

        profileBtn.addEventListener("click", function () {

            localStorage.setItem("name", nameInput.value);
            localStorage.setItem("email", emailInput.value);

            // Update name immediately
            document.getElementById("userName").innerText = nameInput.value;

            alert("Profile Saved Successfully.");

        });

    }


    // ==========================
    // Theme
    // ==========================
    const themes = document.querySelectorAll('input[name="theme"]');

    let savedTheme = localStorage.getItem("theme");

    // Apply saved theme
    if (savedTheme === "Dark Mode") {

        document.body.classList.add("dark-mode");

    } else {

        document.body.classList.remove("dark-mode");

    }

    themes.forEach(theme => {

        if (theme.parentElement.textContent.trim() === savedTheme) {
            theme.checked = true;
        }

        theme.addEventListener("change", function () {

            const selectedTheme = this.parentElement.textContent.trim();

            localStorage.setItem("theme", selectedTheme);

            if (selectedTheme === "Dark Mode") {

                document.body.classList.add("dark-mode");

            } else {

                document.body.classList.remove("dark-mode");

            }

        });

    });


    // ==========================
    // Notifications
    // ==========================
    const notificationCheckboxes =
        document.querySelectorAll(".card:nth-child(3) input[type='checkbox']");

    notificationCheckboxes.forEach((box, index) => {

        box.checked =
            localStorage.getItem("notification" + index) === "true";

        box.addEventListener("change", function () {

            localStorage.setItem(
                "notification" + index,
                this.checked
            );

        });

    });


    // ==========================
    // Privacy
    // ==========================
    const privacyCheckboxes =
        document.querySelectorAll(".card:nth-child(4) input[type='checkbox']");

    privacyCheckboxes.forEach((box, index) => {

        box.checked =
            localStorage.getItem("privacy" + index) === "true";

        box.addEventListener("change", function () {

            localStorage.setItem(
                "privacy" + index,
                this.checked
            );

        });

    });


    // ==========================
    // Data Management
    // ==========================
    const dataButtons =
        document.querySelectorAll(".card:nth-child(5) button");

    if (dataButtons.length >= 2) {

        // Export Entries
        dataButtons[0].addEventListener("click", function () {

            fetch("/entriesdata")
                .then(res => res.json())
                .then(data => {

                    const blob = new Blob(
                        [JSON.stringify(data, null, 2)],
                        { type: "application/json" }
                    );

                    const url = URL.createObjectURL(blob);

                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "MindCanvas_Entries.json";
                    a.click();

                    URL.revokeObjectURL(url);

                });

        });


        // Clear Data
        dataButtons[1].addEventListener("click", function () {

            if (confirm("Delete all journal entries?")) {

                fetch("/delete", {

                    method: "DELETE"

                })
                    .then(res => res.json())
                    .then(data => {

                        alert(data.message);

                        location.reload();

                    });

            }

        });

    }


    // ==========================
    // Account
    // ==========================
    const accountButtons =
        document.querySelectorAll(".card:nth-child(6) button");

    if (accountButtons.length >= 2) {

        // Logout
        accountButtons[0].addEventListener("click", function () {

            if (confirm("Do you want to log out?")) {

                localStorage.clear();

                window.location.href = "/";

            }

        });


        // Delete Account
        accountButtons[1].addEventListener("click", function () {

            if (confirm("Are you sure you want to delete your account?")) {

                fetch("/delete_account", {

                    method: "DELETE"

                })
                    .then(res => res.json())
                    .then(data => {

                        alert(data.message);

                        localStorage.clear();

                        window.location.href = "/";

                    })
                    .catch(() => {

                        alert("Delete Account API is not available yet.");

                    });

            }

        });

    }

};


// ==========================
// Current Date
// ==========================
function showCurrentDate() {

    const today = new Date();

    const formattedDate = today.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

    const dateElement = document.getElementById("currentDate");

    if (dateElement) {

        dateElement.innerHTML = `📅 ${formattedDate}`;

    }

}