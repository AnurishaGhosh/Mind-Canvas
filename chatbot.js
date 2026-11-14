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
    loadChatHistory();
};




const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const typing = document.getElementById("typing");
const clearChat = document.getElementById("clearChat");
clearChat.addEventListener("click", async () => {

    if (!confirm("Do you want to delete this chat?")) {
        return;
    }

    try {
        console.log("Deleting chat for:", localStorage.getItem("email"));

        const response = await fetch("/clear_chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: localStorage.getItem("email")
            })
        });

        const data = await response.json();

        if (data.success) {

            chatBox.innerHTML = "";

            addMessage(`
                👋 Hello! I'm <strong>Eva</strong>.<br><br>

                I can help you:<br><br>

                💙 Understand your mood<br>
                📖 Reflect on journal entries<br>
                🌿 Suggest wellness activities<br>
                📊 Explain your reports<br>
                💬 Answer mental wellness questions
            `, "bot");

        }

    } catch (error) {
        console.error(error);
        alert("Failed to delete chat.");
    }

});


// ---------------- Auto Resize ----------------
userInput.addEventListener("input", () => {
    userInput.style.height = "auto";
    userInput.style.height = userInput.scrollHeight + "px";
});

// ---------------- Enter to Send ----------------
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendBtn.addEventListener("click", sendMessage);

// ---------------- Add Message ----------------
function addMessage(text, sender) {

    const messageDiv = document.createElement("div");
    messageDiv.classList.add(sender === "user" ? "user-message" : "bot-message");

    if (sender === "bot") {

        messageDiv.innerHTML = `
            <div class="avatar">
                <img src="../static/Eva pp.png" style="height:70px;">
            </div>

            <div class="message">
                ${text}
            </div>
        `;

    } else {

        messageDiv.innerHTML = `
            <div class="message user">
                ${text}
            </div>
        `;

    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ---------------- Send ----------------
async function sendMessage() {

    const message = userInput.value.trim();

    if (message === "") return;

    addMessage(message, "user");

    userInput.value = "";
    userInput.style.height = "40px";

    typing.style.display = "flex";
    chatBox.scrollTop = chatBox.scrollHeight;
    sendBtn.disabled = true;

    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message,
                email: localStorage.getItem("email")
            })

        });
        console.log(response.status);
        const data = await response.json();
        console.log(data);
        typing.style.display = "none";
        sendBtn.disabled = false;
        addMessage(data.reply, "bot");

    } catch (error) {

        typing.style.display = "none";
        sendBtn.disabled = false;
        addMessage("⚠️ Sorry, something went wrong.", "bot");

        console.error(error);
    }

}

