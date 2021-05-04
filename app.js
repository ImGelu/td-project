// Server Side

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

// Detects a signal from the Client when a new socket connection has been made
io.on("connection", (socket) => {
  // Detects a signal from the Client when a new user has joined the room
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Sends a message to the current user
    socket.emit("message", formatMessage("Bot", `You've joined the <strong>${user.room}</strong> room. Welcome!`)); // .emit() sends a message to the current user

    // Sends a message to everyone in the current room when someone enters it
    socket.broadcast.to(user.room).emit("message", formatMessage("Bot", `<strong>${user.username}</strong> has joined the room!`)); // .broadcast() sends a message to all clients in the current namespace except the sender

    // Sends a signal to the Client to handle the users room list
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Detects a signal from the Client when a new chat message has been sent
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    // Sends a signal to the Client to handle the new sent message
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Detects a signal from the Client when an user's socket connection is lost
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      // Sends a signal to the Client to handle the departure of the user
      io.to(user.room).emit("userLeave");

      // Sends a signal to the Client to send a message to everyone in the room
      io.to(user.room).emit("message", formatMessage("Bot", `<strong>${user.username}</strong> has left the room!`));
    }
  });
});

// Checking if the Server is running correctly
server.listen(port, () => {
  console.log(`Server running on port ${port}!`);
});
