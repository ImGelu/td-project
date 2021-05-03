const express = require("express");
const socket = require("socket.io");
const http = require("http");
const path = require("path");

const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users");

const app = express();
const port = process.env.PORT || 8000;
const server = http.createServer(app);
const io = socket(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Sends a message to everyone
    socket.emit("message", formatMessage("Bot", "Welcome!"));

    // Broadcast when an user connects
    socket.broadcast.to(user.room).emit("message", formatMessage("Bot", `${user.username} has joined the room!`)); // to all clients in the current namespace except the sender

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Runs when a client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit("message", formatMessage("Bot", `${user.username} has left the chat!`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}!`);
});
