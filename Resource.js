window.onload = function () {


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



};




// ==========================
// Breathing Exercise
// ==========================

function openBreathing() {


    window.open(

        "https://youtu.be/LiUnFJ8P4gM?si=yzjzlGYg3CUdW66W",

        "_blank"

    );

}




// ==========================
// Relaxing Music
// ==========================

function playMusic() {


    window.open(

        "https://open.spotify.com/track/0zqWV67DuqFzLXiLJsAk9Z?si=Hxz4VVaQS9uAT-QZTlhZXA&utm_source=copy-link",

        "_blank"

    );

}




// ==========================
// Journal Tips
// ==========================

function readJournalTips() {


    let tips = [


        "Write three things you are grateful for today.",


        "Describe your happiest moment this week.",


        "Write about one challenge and how you handled it.",


        "What made you smile today?",


        "What is one goal for tomorrow?"


    ];



    let random = Math.floor(

        Math.random() * tips.length

    );



    alert(

        "📖 Today's Journal Prompt\n\n" +

        tips[random]

    );


}




// ==========================
// Stress Management
// ==========================

function exploreStressManagement() {


    alert(

        "🌿 Stress Management Tips\n\n" +

        "✔ Take deep breaths\n\n" +

        "✔ Drink enough water\n\n" +

        "✔ Go for a short walk\n\n" +

        "✔ Listen to calming music\n\n" +

        "✔ Talk to someone you trust"

    );


}




// ==========================
// Positive Affirmations
// ==========================

function viewAffirmations() {


    let affirmations = [


        "I am strong.",


        "I believe in myself.",


        "I can overcome challenges.",


        "I deserve happiness.",


        "Today is a fresh start."


    ];



    let random = Math.floor(

        Math.random() * affirmations.length

    );



    alert(

        "💛 Positive Affirmation\n\n" +

        affirmations[random]

    );


}




// ==========================
// Sleep Tips
// ==========================

function learnSleepTips() {


    alert(

        "😴 Better Sleep Tips\n\n" +

        "🌙 Sleep for 7-8 hours\n\n" +

        "📱 Avoid phones before bed\n\n" +

        "☕ Avoid caffeine at night\n\n" +

        "🛏 Keep a regular bedtime"

    );


}

showCurrentDate();

function showCurrentDate() {


    const today = new Date();


    const formattedDate = today.toLocaleDateString(
        "en-IN",
        {
            day:"2-digit",
            month:"short",
            year:"numeric"
        }
    );


    const dateElement =
    document.getElementById("currentDate");


    if(dateElement){

        dateElement.innerHTML =
        `📅 ${formattedDate}`;

    }


}
