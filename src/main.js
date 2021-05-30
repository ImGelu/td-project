// Client Side

import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import VueRouter from "vue-router";
import axios from "axios";
import VueSocketIOExt from "vue-socket.io-extended";
import { io } from "socket.io-client";

import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/style.css";

// var room = "Room Name!";

const port = process.env.PORT || 8000;
const socket = io("http://localhost:" + port);

Vue.use(VueSocketIOExt, socket);
Vue.use(VueRouter);
Vue.use(Vuex);

const store = new Vuex.Store({
  state() {
    return {
      user: {},
    };
  },
  mutations: {
    setLoggedInUser(state, user) {
      state.user = user;
    },
  },
  plugins: [createPersistedState()],
});

// Whenever an user opens a new socket connection, the Client sends a signal to the Server that an user has joined the room
// socket.emit("joinRoom", { username: store.state.user.username, room });

// Detects a signal from the Server when a new message has been sent
socket.on("message", (message) => {
  outputMessage(message);

  const chatMessages = document.querySelector(".chat-messages");
  if (store.state.user.username) {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});

///////////////////////////////////////////////////

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");

  if (message.role == 0) {
    div.innerHTML = `<p class="meta">${message.username} <span class="float-right">${message.time}</span></p><p class="text">${message.text}</p>`;
  } else {
    div.innerHTML = `<p class="meta">${message.username} <span class='badge badge-danger'>Administrator</span> &bull; <span class="float-right">${message.time}</span></p><p class="text">${message.text}</p>`;
  }

  if (store.state.user.username) {
    document.querySelector(".chat-messages").appendChild(div);
  }
}

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

export default axios.create({
  baseURL: "http://localhost:8081/api",
  headers: {
    "Content-type": "application/json",
  },
});
