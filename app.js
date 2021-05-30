// Server Side

const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users");
const db = require("./models");

const express = require("express");
const cors = require("cors");
const path = require("path");
const mysql = require("mysql2");

var app = require("express")();
var socket = require("socket.io");

const port = process.env.PORT || 8000;

var server = app.listen(port, () => {
  console.log(`Server running on port ${port}!`);
});

let io = socket(server, {
  cors: {
    origin: "*",
  },
});

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./routes/user.routes")(app);

db.sequelize.sync();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat",
});

app.use(express.static(path.join(__dirname, "public")));

// Detects a signal from the Client when a new socket connection has been made
io.on("connection", async (socket) => {
  // Detects a signal from the Client when a new user has joined the room
  socket.on("joinRoom", async ({ username, room, role }) => {
    const user = userJoin(socket.id, username, room, role);
    socket.join(user.room);

    // Sends a message to the current user
    socket.emit("message", formatMessage({ username: "🤖 <span class='badge badge-primary'>Robot</span> &bull;", role: "" }, `Bun venit în canalul <strong>${user.room}</strong>!`)); // .emit() sends a message to the current user

    // Sends a message to everyone in the current room when someone enters it
    socket.broadcast.to(user.room).emit("message", formatMessage({ username: "🤖 <span class='badge badge-primary'>Robot</span> &bull;", role: "" }, `<strong>${user.username}</strong> a intrat în canal!`)); // .broadcast() sends a message to all clients in the current namespace except the sender

    // Sends a signal to the Client to handle the users room list
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Detects a signal from the Client when a new chat message has been sent
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    console.log(user);
    // Sends a signal to the Client to handle the new sent message
    io.to(user.room).emit("message", formatMessage(user, msg));
  });

  // Detects a signal from the Client when an user's socket connection is lost
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      // Sends a signal to the Client to handle the departure of the user
      io.to(user.room).emit("userLeave", user);

      // Sends a signal to the Client to send a message to everyone in the room
      io.to(user.room).emit("message", formatMessage({ username: "🤖 <span class='badge badge-primary'>Robot</span> &bull;", role: "" }, `<strong>${user.username}</strong> a ieșit din canal!`));
    }
  });
});

// Open the connection to the database
connection.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Connection established");
});
