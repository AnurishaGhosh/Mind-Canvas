window.onload = function () {

    // ================= USER NAME =================
    const userName = localStorage.getItem("name");
    const userNameElement = document.getElementById("userName");

    if (userNameElement) {
        userNameElement.innerText = userName || "Guest";
    }

    // ================= PROFILE IMAGE =================
    const gender = localStorage.getItem("gender");
    const profilePic = document.getElementById("profilePic");

    if (profilePic) {

        if (gender === "Male") {

            profilePic.src = "../static/male.png";

        }

        else if (gender === "Female") {

            profilePic.src = "../static/female.png";

        }

        else {

            profilePic.src = "../static/profile.png";

        }
    }

    // ================= BUTTON =================
    const saveButton = document.querySelector(".btn");

    if (saveButton) {
        saveButton.addEventListener("click", saveEntry);
    }

    displayEntries();

};


// ---------------- DATE ----------------------
function showCurrentDate() {

    const today = new Date();

    const formattedDate = today.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    document.getElementById("currentDate").innerHTML =
        `📅 ${formattedDate}`;
}

showCurrentDate();


// ---------------- SAVE ENTRY ----------------

function saveEntry(){
    const title=document.querySelector('input[type="text"]').value.trim();
    const content=document.querySelector("textarea").value.trim();
    if(title==="" || content===""){
        alert("Please fill both fields");
        return;
    }
    fetch("/save",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            email: localStorage.getItem("email"),
            title:title,
            content:content
        })
    })
    .then(response=>response.json())
    .then(data => {

    alert(data.message);

    document.querySelector('input[type="text"]').value = "";
    document.querySelector("textarea").value = "";

    displayEntries();

    // ===============================
    // Complete Gratitude Journal Activity
    // ===============================

    if (localStorage.getItem("journalPending") === "true") {

        let email = localStorage.getItem("email");

        let key = "activities_" + email;

        let activityData = JSON.parse(localStorage.getItem(key));

        if (activityData) {

            if (!activityData.completed.includes(1)) {

                activityData.completed.push(1);

                localStorage.setItem(
                    key,
                    JSON.stringify(activityData)
                );

            }

        }

        localStorage.removeItem("journalPending");

        // Go back to Activity page
        window.location.href = "/activity";
    }

})
    .catch(error=>{
        console.log(error);


        alert("Save failed");


    });


}

// ---------------- DISPLAY ENTRIES ----------------

function displayEntries(){
    const entryList=document.getElementById("entryList");
    if(!entryList){
        return;
    }
    fetch("/entriesdata", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: localStorage.getItem("email")
        })
    })
    .then(response=>response.json())
    .then(entries=>{
        entryList.innerHTML="";
        if (entries.length === 0) {

    entryList.innerHTML = `

        <br><br>
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            min-height: 300px;
        ">

            <h3 style="
                color: black  ;
                margin: 0;
                text-align: center;
            ">
                <b>No entries yet</b>
            </h3>

        </div>

    `;

    return;
}





        entries.slice(0,2).forEach(entry=>{



            let date=new Date(entry.created_at)
            .toLocaleDateString("en-GB");



            let time=new Date(entry.created_at)
            .toLocaleTimeString([],{

                hour:"2-digit",

                minute:"2-digit"

            });






            entryList.innerHTML+=`



            <div class="entry-card">



                <small>

                📅 ${date}

                🕒 ${time}

                </small>



                <h4>
                📖 ${entry.title}
                </h4>
                <p>
                ${entry.content}
                </p>
                <button onclick="deleteEntry('${entry._id}')">
                Delete
                </button>
                <br><br>
            </div>


            `;



        });



    })



    .catch(error=>console.log(error));



}





// ---------------- DELETE ONE ----------------


function deleteEntry(id){



    if(confirm("Delete this entry?")){


        fetch(`/delete-entry/${id}`,{


            method:"DELETE",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
            email: localStorage.getItem("email")
            })
        })



        .then(response=>response.json())



        .then(data=>{


            alert(data.message);


            displayEntries();


        });



    }


}






// ---------------- DELETE ALL ----------------


function removeEntries(){



    if(confirm("Delete all entries?")){


        fetch("/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: localStorage.getItem("email")
            })
        })



        .then(response=>response.json())



        .then(data=>{


            alert(data.message);


            displayEntries();


        });



    }


}