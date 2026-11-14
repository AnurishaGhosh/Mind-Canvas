window.onload = function () {

    // ==========================
    // Current Date
    // ==========================
    showCurrentDate();

    // ==========================
    // User Name
    // ==========================
    let userName = localStorage.getItem("name");

    if (userName) {
        document.getElementById("userName").innerText = userName;
    }

    // ==========================
    // Profile Picture
    // ==========================
    let gender = localStorage.getItem("gender");

    if (gender === "Male") {
        document.getElementById("profilePic").src = "../static/male.png";
    }
    else if (gender === "Female") {
        document.getElementById("profilePic").src = "../static/female.png";
    }

    // ==========================
    // Load Dashboard Data
    // ==========================
    loadMoodGraph();
    loadJournalGraph();
    loadStreakCard();
    loadWellness();
    loadCommonMood();
    loadSuggestion();
};



// ====================================
// Mood Graph
// ====================================
function loadMoodGraph() {

    fetch("/moodgraph")
    .then(response => response.json())
    .then(data => {

        const labels = Object.keys(data);
        const values = Object.values(data);

        const ctx = document.getElementById("moodChart");

        new Chart(ctx, {

            type: "bar",

            data: {

                labels: labels,

                datasets: [{
                    label: "Mood Count",
                    data: values,
                    borderWidth: 1
                }]
            },

            options: {

                responsive: true,

                plugins: {
                    legend: {
                        display: false
                    }
                },

                scales: {
                    y: {
                        beginAtZero: true
                    }
                }

            }

        });

    });

}



// ====================================
// Weekly Journal Graph
// ====================================
function loadJournalGraph() {

    fetch("/journalgraph")
    .then(response => response.json())
    .then(data => {

        const labels = Object.keys(data);
        const values = Object.values(data);

        const ctx = document.getElementById("journalChart");

        new Chart(ctx, {

            type: "line",

            data: {

                labels: labels,

                datasets: [{

                    label: "Mental Health Score",

                    data: values,

                    fill: false,

                    tension: 0.3

                }]

            },

            options: {

                responsive: true,

                plugins:{
                    legend:{
                        display:false
                    }
                },

                scales: {

                    y: {

                        beginAtZero: true,

                        max:100

                    }

                }

            }

        });

    });

}



// ====================================
// Current Streak
// ====================================
function loadStreakCard() {

    fetch("/streak")
    .then(response => response.json())
    .then(data => {

        document.getElementById("streakCard").innerHTML =
            data.streak + " Days";

        if (data.streak >= 7) {

            document.getElementById("streakText").innerHTML =
                "Excellent consistency!";

        }

        else if (data.streak >= 3) {

            document.getElementById("streakText").innerHTML =
                "You're doing well. Keep it up!";

        }

        else {

            document.getElementById("streakText").innerHTML =
                "Start journaling every day.";

        }

    });

}



// ====================================
// Wellness Score
// ====================================
function loadWellness() {

    fetch("/wellness")
    .then(response => response.json())
    .then(data => {

        document.getElementById("wellnessScore").innerHTML =
            data.score + "%";

        document.getElementById("wellnessFill").style.width =
            data.score + "%";

        if (data.score >= 80) {

            document.getElementById("wellnessText").innerHTML =
                "Excellent wellness";

        }

        else if (data.score >= 60) {

            document.getElementById("wellnessText").innerHTML =
                "Good progress";

        }

        else {

            document.getElementById("wellnessText").innerHTML =
                "Keep improving";

        }

    });

}



// ====================================
// Most Common Mood
// ====================================
function loadCommonMood() {

    fetch("/mostmood")
    .then(response => response.json())
    .then(data => {

        document.getElementById("commonMood").innerHTML =
            data.mood;

        document.getElementById("commonMoodCount").innerHTML =
            "Recorded " + data.count + " times";

    });

}



// ====================================
// Suggested Activity
// ====================================
let currentButton = "";

function loadSuggestion() {

    fetch("/suggestion")
    .then(response => response.json())
    .then(data => {

        document.getElementById("suggestionText").innerHTML =
            data.activity;

        document.getElementById("activityButton").innerHTML =
            data.button;

        currentButton = data.button;

    });

}



// ====================================
// Start Suggested Activity
// ====================================
function startActivity() {

    if (currentButton === "Write Journal") {

        window.location.href = "/journal";

    }

    else if (currentButton === "Meditate") {

        window.location.href = "/activity";

    }

    else if (currentButton === "Mindful Breathing") {

        window.location.href = "/resources";

    }

    else if (currentButton === "Relaxing Music") {

        window.location.href = "/resources";

    }

    else {

        window.location.href = "/activity";

    }

}



// ====================================
// Current Date
// ====================================
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