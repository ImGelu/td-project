// Client Side

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const chatRoomName = document.getElementById("room-name");
const chatRoomUsers = document.getElementById("room-users");
const hamburgerBtn = document.getElementById("btn-sidebar");
const chatSidebar = document.getElementById("chat-sidebar");

// Getting username and room parameters from URL query
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Whenever an user opens a new socket connection, the Client sends a signal to the Server that an user has joined the room
socket.emit("joinRoom", { username, room });

// Detects a signal from the Server when the users list needs to be loaded in the DOM
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputRoomUsers(users);
});

// Detects a signal from the Server when an user has left the room
socket.on("userLeave", () => {
  removeUserFromRoom(socket.id);
});

// Detects a signal from the Server when a new message has been sent
socket.on("message", (message) => {
  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

///////////////////////////////////////////////////

// Send message button event listener
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit("chatMessage", msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span class="float-right">${message.time}</span></p><p class="text">${message.text}</p>`;

  document.querySelector(".chat-messages").appendChild(div);
}

// Output room name to DOM
function outputRoomName(room) {
  chatRoomName.innerText = room;
}

// Add room users to DOM
function outputRoomUsers(users) {
  chatRoomUsers.innerHTML = `${users.map((user) => `<li id="room-user-${user.id}">${user.username}</li>`).join("")}`;
}

// Remove user from DOM list
function removeUserFromRoom(id) {
  const li = document.getElementById(`room-user-${id}`);
  li.remove();
}

// Bootstrap Tooltip initialization
var locationTooltip = document.getElementById("btn-location");
var tooltip = new bootstrap.Tooltip(locationTooltip);

// Hamburger menu behaviour
hamburgerBtn.addEventListener("click", (e) => {
  if (chatSidebar.style.display === "none") {
    chatSidebar.style.display = "block";
  } else {
    chatSidebar.style.display = "none";
  }
});
