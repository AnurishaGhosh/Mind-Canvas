let allEntries = [];

document.addEventListener("DOMContentLoaded", () => {

    loadEntries();

    // Search
    document.getElementById("searchBox").addEventListener("input", searchEntries);

    

});


// ---------------- LOAD ENTRIES ----------------

function loadEntries() {

    fetch("/entriesdata")
        .then(response => response.json())
        .then(data => {

            allEntries = data;

            displayEntries(allEntries);

            updateStats();

        })
        .catch(error => console.error(error));

}


// ---------------- DISPLAY ENTRIES ----------------

function displayEntries(entries) {

    const entryGrid = document.getElementById("entryGrid");

    entryGrid.innerHTML = "";

    if (entries.length === 0) {

        entryGrid.innerHTML = `
        <br><br><br><br><br><br>

        <h2 style="color:black;text-align:center;width:100%;">
                No Journal Entries Found
            </h2>
            <br><br><br><br>
        `;

        return;
    }


    <br><br><br><br></br>

    entries.forEach(entry => {

        let date = new Date(entry.created_at);

        let formattedDate = date.toLocaleDateString("en-GB");

        let formattedTime = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

        entryGrid.innerHTML += `

        <div class="entry-card">

            <div class="date">
                📅 ${formattedDate} &nbsp;&nbsp; 🕒 ${formattedTime}
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


// ---------------- SEARCH ----------------

function searchEntries() {

    const keyword = document
        .getElementById("searchBox")
        .value
        .toLowerCase();

    const filtered = allEntries.filter(entry => {

        return (
            entry.title.toLowerCase().includes(keyword) ||
            entry.content.toLowerCase().includes(keyword)
        );

    });

    displayEntries(filtered);

}


// ---------------- DELETE ----------------

function deleteEntry(id) {

    if (!confirm("Delete this journal entry?"))
        return;

    fetch("/delete-entry/" + id, {

        method: "DELETE"

    })

    .then(response => response.json())

    .then(data => {

        alert(data.message);

        loadEntries();

    })

    .catch(error => {

        console.error(error);

    });

}


// ---------------- EDIT ----------------

function editEntry(id) {

    alert("Edit functionality will be added later.");

}


// ---------------- UPDATE STATS ----------------

function updateStats() {

    document.querySelectorAll(".box h2")[0].innerText = allEntries.length;

    document.querySelectorAll(".box h2")[1].innerText = allEntries.length;

    document.querySelectorAll(".box h2")[2].innerText = allEntries.length + " Days";

    document.querySelectorAll(".box h2")[3].innerText = "-";

}