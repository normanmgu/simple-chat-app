const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

socket.on("message", message =>{
    outputMessage(message);
    console.log(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Message submit
chatForm.addEventListener("submit", (event) =>{
    event.preventDefault();

    // Get message text
    const msg = event.target.elements.msg.value;

    // Emitting a message to the server
    socket.emit("chatMessage", msg);

    // Clear input
    event.target.elements.msg.value = "";
    event.target.elements.msg.focus();
})

function outputMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML =
    `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>
    `;
    document.querySelector(".chat-messages").appendChild(div);
}