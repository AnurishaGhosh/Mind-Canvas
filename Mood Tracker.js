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
    // Mood Tracker
    // ==========================


    const form = document.querySelector("form");

    const moodButton = document.querySelector(".save-btn");

    const moodText = document.querySelector(".main-content p");

    const radios = document.querySelectorAll('input[name="mood"]');


    const email = localStorage.getItem("email");



    // Run only if mood page exists

    if (form && moodButton && moodText) {


        loadMood();



        async function loadMood() {


            try {


                const response = await fetch("/get_mood", {


                    method: "POST",


                    headers: {

                        "Content-Type": "application/json"

                    },


                    body: JSON.stringify({

                        email: localStorage.getItem("email"),

                    })


                });



                const data = await response.json();



                if (data.exists) {


                    moodText.innerText = data.mood;


                    moodButton.innerText = "Remove Mood";



                    radios.forEach(radio => {


                        let label = radio.nextElementSibling.innerText.trim();



                        if (label === data.mood) {

                            radio.checked = true;

                        }


                    });



                }

                else {


                    moodText.innerText = "No mood selected yet.";

                    moodButton.innerText = "Save Mood";


                }




            }

            catch(error) {

                console.log(error);

            }


        }





        form.addEventListener("submit", async function(e) {


            e.preventDefault();



            // Remove Mood

            if (moodButton.innerText === "Remove Mood") {


                await fetch("/remove_mood", {


                    method:"POST",


                    headers:{

                        "Content-Type":"application/json"

                    },


                    body:JSON.stringify({

                        email:email

                    })


                });



                moodText.innerText =
                "No mood selected yet.";



                radios.forEach(radio => {

                    radio.checked = false;

                });



                moodButton.innerText = "Save Mood";

                return;


            }





            // Save Mood

            let selectedMood = "";



            radios.forEach(radio => {


                if(radio.checked){


                    selectedMood =
                    radio.nextElementSibling.innerText.trim();


                }


            });




            if(selectedMood === ""){


                alert("Please select a mood.");

                return;


            }




            await fetch("/save_mood", {


                method:"POST",


                headers:{

                    "Content-Type":"application/json"

                },


                body:JSON.stringify({


                    email:email,

                    mood:selectedMood


                })


            });



            moodText.innerText = selectedMood;

            moodButton.innerText = "Remove Mood";



        });


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
