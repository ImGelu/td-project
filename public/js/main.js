const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const chatRoomName = document.getElementById("room-name");
const chatRoomUsers = document.getElementById("room-users");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputRoomUsers(users);
});

// Message from server
socket.on("message", (message) => {
  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

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
  console.log(message);
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p><p class="text">${message.text}</p>`;

  document.querySelector(".chat-messages").appendChild(div);
}

// Output room name to DOM
function outputRoomName(room) {
  chatRoomName.innerText = room;
}

// Add room users to DOM
function outputRoomUsers(users) {
  chatRoomUsers.innerHTML = `${users.map((user) => `<li>${user.username}</li>`).join("")}`;
}
