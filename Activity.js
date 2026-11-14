let walkInterval;
let walkTime = 600;      // 10 minutes
let walkPaused = false;

let workoutInterval;
let workoutTime = 3600;  // 1 hour
let workoutPaused = false;


// ===============================
// PAGE LOAD
// ===============================

window.addEventListener("load", function () {

    // User Name
    let userName = localStorage.getItem("name");
    if (userName) {
        document.getElementById("userName").innerText = userName;
    }

    // Profile Picture
    let gender = localStorage.getItem("gender");

    if (gender === "Male") {
        document.getElementById("profilePic").src = "../static/male.png";
    } else if (gender === "Female") {
        document.getElementById("profilePic").src = "../static/female.png";
    }

    showCurrentDate();
    initializeActivities();
    initializeWaterTracker();
    startCueReminders();
    initializeSleepTracker();
    initializeFoodTracker();
    initializeMeTime();

});


// ===============================
// USER STORAGE KEY
// ===============================




async function saveActivity(data) {

    data.email = localStorage.getItem("email");

    try {

        const response = await fetch("/save_activity", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        if (!response.ok) {
            throw new Error("Failed to save activity.");
        }

        const result = await response.json();

        console.log(result);

    }

    catch (err) {

        console.error("Save Error:", err);

    }

}

function getStorageKey() {

    let email = localStorage.getItem("email");

    return "activities_" + email;

}



// ===============================
// LOAD / RESET DAILY DATA
// ===============================

function getActivityData() {

    let key = getStorageKey();

    let today = new Date().toDateString();

    let data = JSON.parse(localStorage.getItem(key));

    if (!data || data.date !== today) {

        data = {

            date: today,

            completed: []

        };

        localStorage.setItem(key, JSON.stringify(data));

    }

    return data;

}



// ===============================
// INITIALIZE BUTTONS
// ===============================

function initializeActivities() {

    let buttons = [

        document.getElementById("meditationBtn"),

        document.querySelectorAll(".activity-btn")[1], // Journal

        document.querySelectorAll(".activity-btn")[2], // Walk

        document.querySelectorAll(".activity-btn")[3], // Workout

        document.getElementById("waterBtn")

    ];

    let data = getActivityData();



    buttons.forEach((button, index) => {

        // Already completed

        if (data.completed.includes(index)) {

            button.innerHTML = "✅ Completed";

            button.disabled = true;

            return;

        }



        // Meditation Button

        if (index === 0) {

            button.onclick = function () {

                window.open(
                    "https://youtu.be/6xeh1X6HPOQ?si=5BZd2honqSH8xJCl",
                    "_blank"
                );

                saveActivity({

                    activity: "meditation",

                    start: new Date(),

                    end: new Date(),

                    duration: 300

                });

                completeActivity(index);
            };

        }
        // Gratitude Journal

        else if (index === 1) {

            button.onclick = function () {

            // Remember user came from Activity page
            localStorage.setItem("journalPending", "true");

            // Open Journal page
            saveActivity({

                activity:"journal"

            });

            window.location.href="/journal"

            };
        }

        

        else if (index === 2) {

            button.onclick = function () {

                button.disabled = true;

                let seconds = 600;   // 10 minutes

                button.innerHTML = "10:00";

                const timer = setInterval(function () {

                    seconds--;

                    let min = Math.floor(seconds / 60);
                    let sec = seconds % 60;

                    button.innerHTML =
                        `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;

                    if (seconds <= 0) {

                        clearInterval(timer);

                        saveActivity({

                            activity: "walk",

                            start: new Date(Date.now() - 600000),

                            end: new Date(),

                            duration: 600

                        });

                        completeActivity(index);

                    }

                },1000);

            };

        }

        else if (index === 3) {

            button.onclick = function () {

                button.disabled = true;

                let seconds = 3600;      // 1 hour

                button.innerHTML = "60:00";

                const timer = setInterval(function () {

                    seconds--;

                    let min = Math.floor(seconds / 60);
                    let sec = seconds % 60;

                    button.innerHTML =
                        `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;

                    if (seconds <= 0) {

                        clearInterval(timer);

                        saveActivity({

                        activity: "workout",

                        start: new Date(Date.now()-3600000),

                        end: new Date(),

                        duration:3600

                    });

                    completeActivity(index);

                }

                },1000);

            };

        }

        // Other Buttons

        else {

            button.onclick = function () {

                completeActivity(index);

            };

        }

    });

    updateProgress();

}



// ===============================
// COMPLETE ACTIVITY
// ===============================

function completeActivity(index) {

    let data = getActivityData();

    if (!data.completed.includes(index)) {

        data.completed.push(index);

        localStorage.setItem(
            getStorageKey(),
            JSON.stringify(data)
        );

    }

    updateProgress();

}


// ===============================
// UPDATE PROGRESS
// ===============================

function updateProgress() {

    let data = getActivityData();


    // Total activities you want to track
    let total = 8;


    let completed = data.completed.length;


    let percentage = Math.round((completed / total) * 100);



    let fill = document.querySelector(".fill");

    if (fill) {

        fill.style.width = percentage + "%";

        fill.innerHTML = percentage + "%";

    }



    const progressText = document.querySelector(".progress p");

    if (progressText) {

        progressText.innerHTML =
        completed + " of " + total + " activities completed";

    }

}



// ===============================
// RESET BUTTON (Optional)
// ===============================

function resetActivities() {

    if (confirm("Reset today's activities?")) {

        localStorage.removeItem(getStorageKey());

        location.reload();

    }

}



// ===============================
// DATE
// ===============================

function showCurrentDate() {

    const today = new Date();

    const formattedDate = today.toLocaleDateString("en-IN", {

        day: "2-digit",

        month: "short",

        year: "numeric"

    });

    document.getElementById("currentDate").innerHTML =

        "📅 " + formattedDate;

}




function initializeWaterTracker() {

    const button = document.getElementById("waterBtn");

    if (!button) return;

    const key = "water_" + localStorage.getItem("email");
    const today = new Date().toDateString();

    let data = JSON.parse(localStorage.getItem(key));

    if (!data || data.date !== today) {

        data = {
            date: today,
            glasses: 0
        };

        localStorage.setItem(key, JSON.stringify(data));
    }

    updateWaterDisplay();

    button.onclick = function () {

        let data = JSON.parse(localStorage.getItem(key));

        if (data.glasses >= 8) return;

        data.glasses++;

        saveActivity({

            activity:"water",

            glasses:data.glasses

        });

        localStorage.setItem(key, JSON.stringify(data));

        updateWaterDisplay();

    };

}

function updateWaterDisplay() {

    const text = document.getElementById("waterText");
    const button = document.getElementById("waterBtn");

    if (!text || !button) return;

    const key = "water_" + localStorage.getItem("email");

    const data = JSON.parse(localStorage.getItem(key));

    let remaining = 8 - data.glasses;

    if (remaining === 1) {

        text.innerHTML = "1 glass of water left 💧";

    } else {

        text.innerHTML = remaining + " glasses of water left 💧";

    }

    if (remaining === 0) {

        button.innerHTML = "✅ Completed";

        button.disabled = true;

        completeActivity(4);

    }

}


// ===============================
// CUE REMINDERS
// ===============================

function startCueReminders() {

    // Check every 5 minutes
    setInterval(function () {

        let data = getActivityData();

        // Meditation
        if (!data.completed.includes(0)) {

            alert("🧘 Reminder\n\nTake a few minutes to meditate.");

        }

        // Gratitude Journal
        else if (!data.completed.includes(1)) {

            alert("📖 Reminder\n\nWrite today's gratitude journal.");

        }

        // Walking
        else if (!data.completed.includes(2)) {

            alert("🚶 Reminder\n\nComplete your 10-minute walk.");

        }

        // Workout
        else if (!data.completed.includes(3)) {

            alert("💪 Reminder\n\nTime for your workout.");

        }

        // Water
        else {

            const key = "water_" + localStorage.getItem("email");
            const waterData = JSON.parse(localStorage.getItem(key));

            if (waterData && waterData.glasses < 8) {

                alert(
                    "💧 Hydration Reminder\n\nDrink one glass of water.\n" +
                    (8 - waterData.glasses) +
                    " glass" +
                    (8 - waterData.glasses === 1 ? "" : "es") +
                    " remaining."
                );

            }

        }

    }, 300000); // 300000 ms = 5 minutes

}


// ===============================
// SLEEP TRACKER
// ===============================

function initializeSleepTracker() {

    const input = document.getElementById("sleepHours");
    const button = document.getElementById("sleepBtn");
    const feedback = document.getElementById("sleepFeedback");

    if (!input || !button || !feedback) return;

    const key = "sleep_" + localStorage.getItem("email");
    const today = new Date().toDateString();

    let data = JSON.parse(localStorage.getItem(key));

    // Already completed today
    if (data && data.date === today) {

        input.value = data.hours;
        input.disabled = true;

        button.innerHTML = "✅ Completed";
        button.disabled = true;

        feedback.innerHTML = data.feedback;

        return;
    }

    button.onclick = function () {

        const hours = parseFloat(input.value);

        if (isNaN(hours) || hours <= 0 || hours > 24) {
            alert("Please enter a valid sleep duration.");
            return;
        }

        let message = "";

        if (hours < 5) {

            message = "😴 You slept too little. Try to get more rest.";

        }
        else if (hours < 7) {

            message = "🙂 Your sleep is okay, but aim for 7–9 hours.";

        }
        else if (hours <= 9) {

            message = "😊 Great! You had a healthy amount of sleep.";

        }
        else {

            message = "😅 You slept quite a lot. Make sure you're feeling refreshed.";

        }

        saveActivity({

            activity: "sleep",

            hours: hours

        });

        localStorage.setItem(key, JSON.stringify({

            date: today,

            hours: hours,

            feedback: message

        }));

        feedback.innerHTML = message;

        input.disabled = true;

        button.innerHTML = "✅ Completed";

        button.disabled = true;

        completeActivity(5);

    };

}

// ===============================
// ME TIME TRACKER
// ===============================

function initializeMeTime() {

    const button = document.getElementById("meTimeBtn");
    const text = document.getElementById("meTimeText");

    if (!button) return;

    const key = "meTime_" + localStorage.getItem("email");

    let timerInterval;

    // Restore previous session
    let data = JSON.parse(localStorage.getItem(key));

    if (data) {

        // Session running
        if (data.status === "running") {

            button.innerHTML = "Finish Session";

            startTimer(new Date(data.start));

        }

        // Already completed today
        else if (data.status === "completed") {

            button.innerHTML = "✅ Completed";
            button.disabled = true;

            if (text) {
                text.innerHTML =
                    "Completed: " + formatDuration(data.duration);
            }

            return;
        }

    }

    button.onclick = function () {

        let data = JSON.parse(localStorage.getItem(key));

        // ======================
        // START SESSION
        // ======================
        if (!data || data.status !== "running") {

            const startTime = new Date();

            localStorage.setItem(key, JSON.stringify({

                status: "running",

                start: startTime.toISOString()

            }));

            button.innerHTML = "Finish Session";

            startTimer(startTime);

            return;

        }

        // ======================
        // FINISH SESSION
        // ======================

        clearInterval(timerInterval);

        const endTime = new Date();

        const startTime = new Date(data.start);

        const durationSeconds = Math.round(
            (endTime - startTime) / 1000
        );

        saveActivity({

            activity: "me_time",

            start: startTime,

            end: endTime,

            duration: durationSeconds

        });

        localStorage.setItem(key, JSON.stringify({

            status: "completed",

            start: startTime.toISOString(),

            end: endTime.toISOString(),

            duration: durationSeconds

        }));

        if (text) {

            text.innerHTML =
                "Completed: " +
                formatDuration(durationSeconds);

        }

        button.innerHTML = "✅ Completed";

        button.disabled = true;

        completeActivity(7);

    };



    // ======================
    // LIVE TIMER
    // ======================

    function startTimer(startTime) {

        updateTimer(startTime);

        timerInterval = setInterval(function () {

            updateTimer(startTime);

        }, 1000);

    }



    function updateTimer(startTime) {

        const seconds = Math.floor(

            (new Date() - startTime) / 1000

        );

        if (text) {

            text.innerHTML =
                "Elapsed Time: " +
                formatDuration(seconds);

        }

    }



    function formatDuration(seconds) {

        const hrs = Math.floor(seconds / 3600);

        const mins = Math.floor((seconds % 3600) / 60);

        const secs = seconds % 60;

        return (
            String(hrs).padStart(2, "0") + ":" +
            String(mins).padStart(2, "0") + ":" +
            String(secs).padStart(2, "0")
        );

    }

}


// ===============================
// FOOD TRACKER
// ===============================

function initializeFoodTracker() {

    const key = "food_" + localStorage.getItem("email");

    const status = document.getElementById("foodStatus");

    const meals = [
        { id: "breakfastBtn", name: "Breakfast" },
        { id: "lunchBtn", name: "Lunch" },
        { id: "snackBtn", name: "Evening Snack" },
        { id: "dinnerBtn", name: "Dinner" }
    ];

    const today = new Date().toDateString();

    let data = JSON.parse(localStorage.getItem(key));

    if (!data || data.date !== today) {

        data = {

            date: today

        };

        localStorage.setItem(key, JSON.stringify(data));

    }

    meals.forEach(function(meal) {

        const button = document.getElementById(meal.id);

        if (!button) return;

        // Already completed
        if (data[meal.name] && data[meal.name].completed) {

            button.innerHTML = "✅ Completed";
            button.disabled = true;
            return;
        }

        button.onclick = function() {

            // Start
            if (!data[meal.name]) {

                data[meal.name] = {
                    start: new Date(),
                    completed: false
                };

                localStorage.setItem(key, JSON.stringify(data));

                button.innerHTML = "Finish " + meal.name;
            }

            // Finish
            else {

                data[meal.name].end = new Date();

                data[meal.name].completed = true;
                saveActivity({

                activity:"food",

                meal:meal.name,

                start:data[meal.name].start,

                end:data[meal.name].end,

                duration:Math.round(
                    (new Date(data[meal.name].end)-new Date(data[meal.name].start))/1000
                )

            });

                localStorage.setItem(key, JSON.stringify(data));

                button.innerHTML = "✅ Completed";

                button.disabled = true;

                checkFoodCompletion(data);

            }

        };

    });

}

function checkFoodCompletion(data) {

    if (
        data["Breakfast"]?.completed &&
        data["Lunch"]?.completed &&
        data["Evening Snack"]?.completed &&
        data["Dinner"]?.completed
    ) {
        const status = document.getElementById("foodStatus");

        if (status) {
            status.innerHTML = "✅ All meals completed today";
        }

        console.log("All meals completed");
        completeActivity(6);
        console.log(getActivityData().completed);
    }
}