let allEntries = [];


// ==========================
// PAGE LOAD
// ==========================

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
    // Show Current Date
    // ==========================

    showCurrentDate();



    // ==========================
    // Load Journal Entries
    // ==========================

    loadEntries();



    const searchBox = document.getElementById("searchBox");


    if (searchBox) {


        searchBox.addEventListener(
            "input",
            searchEntries
        );


    }


};




// ==========================
// DATE
// ==========================

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




// ==========================
// LOAD ENTRIES
// ==========================

function loadEntries() {


    fetch("/entriesdata")


    .then(response => response.json())


    .then(data => {


        allEntries = data;


        displayEntries(allEntries);


        updateStats();


    })


    .catch(error => {


        console.error(
            "Error:",
            error
        );


    });


}




// ==========================
// DISPLAY ENTRIES
// ==========================

function displayEntries(entries) {


    const entryGrid =
    document.getElementById("entryGrid");



    if(!entryGrid){

        console.error("entryGrid not found");

        return;

    }



    entryGrid.innerHTML = "";



    if(entries.length === 0){


        entryGrid.innerHTML = `

        <div class="no-entry">

            <h2>No Journal Entries Found</h2>

        </div>

        `;


        return;


    }





    entries.forEach(function(entry){



        const date =
        new Date(entry.created_at);



        const formattedDate =
        date.toLocaleDateString("en-GB");



        const formattedTime =
        date.toLocaleTimeString([],{

            hour:"2-digit",

            minute:"2-digit"

        });




        entryGrid.innerHTML += `

        <div class="entry-card">


            <div class="date">

                📅 ${formattedDate}

                &nbsp;&nbsp;

                🕒 ${formattedTime}

            </div>



            <h3>${entry.title}</h3>


            <p>${entry.content}</p>



            <div class="buttons">


                <button onclick="editEntry('${entry._id}')">

                    Edit

                </button>



                <button onclick="deleteEntry('${entry._id}')">

                    Delete

                </button>



            </div>


        </div>

        `;



    });


}





// ==========================
// SEARCH
// ==========================

function searchEntries(){


    const keyword =
    document.getElementById("searchBox")
    .value
    .toLowerCase();



    const filtered =
    allEntries.filter(function(entry){


        return (

            entry.title
            .toLowerCase()
            .includes(keyword)


            ||

            entry.content
            .toLowerCase()
            .includes(keyword)

        );


    });



    displayEntries(filtered);


}




// ==========================
// DELETE ENTRY
// ==========================

function deleteEntry(id){



    if(!confirm("Delete this journal entry?")){

        return;

    }




    fetch("/delete-entry/" + id, {


        method:"DELETE"


    })


    .then(response=>response.json())


    .then(data=>{


        alert(data.message);


        loadEntries();


    })


    .catch(error=>{


        console.error(error);


    });



}





// ==========================
// EDIT ENTRY
// ==========================

function editEntry(id){


    alert(
        "Edit functionality will be added later."
    );


}




// ==========================
// UPDATE STATS
// ==========================

function updateStats(){



    const boxes =
    document.querySelectorAll(".box h2");



    if(boxes.length < 4){

        return;

    }



    boxes[0].innerText =
    allEntries.length;



    boxes[1].innerText =
    allEntries.length;



    boxes[2].innerText =
    allEntries.length + " Days";



    boxes[3].innerText =
    "-";


}