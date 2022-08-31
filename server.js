const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const formatMessage = require("./utils/message");
const { userJoin, getCurrentUser } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "/public")));

const botName = "ChatCord bot";

// Run when a client connects
io.on("connection", (socket) =>{

    socket.on("joinRoom", ({ username, room }) =>{
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Only sends to the user that connected
        socket.emit("message", formatMessage(botName, "Welcome to ChatCord"));

        // Broadcast when a user connects. Sends to all except the user that connected
        socket.broadcast
            .to(user.room)
            .emit("message", formatMessage(botName, `${user.username} has joined the chat`));
    })

    // Runs when user disconnects
    socket.on("disconnect", () =>{

        io.emit("message", formatMessage(botName, `A user has left the chat`));
    })

    // Listen for chat messages
    socket.on("chatMessage", (msg) =>{
        const user = getCurrentUser(socket.id);
        console.log(user)

        io.to(user.room).emit("message", formatMessage(user.username, msg));
    })

})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
})