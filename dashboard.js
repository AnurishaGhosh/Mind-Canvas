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


    // ==========================
    // Pulse Heartbeat Animation
    // ==========================
    const pulse = document.querySelector(".pulse-svg polyline");

    if (pulse) {

        let length = pulse.getTotalLength();

        pulse.style.strokeDasharray = length;
        pulse.style.strokeDashoffset = length;

        let offset = length;


        function animatePulse() {

            offset -= 2;

            if (offset <= 0) {
                offset = length;
            }

            pulse.style.strokeDashoffset = offset;

            requestAnimationFrame(animatePulse);
        }


        animatePulse();

    }

};


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
