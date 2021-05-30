<template>
  <div class="chat-container">
    <header class="chat-header">
      <div class="btn-group">
        <button class="btn btn-success btn-sm" type="button">
          Conectat ca <strong>{{ $store.state.user.username }}</strong>
        </button>
        <button type="button" class="btn btn-sm btn-success" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" @click="goToSettings">
          <i class="fa fa-cogs"></i>
        </button>
      </div>
      <h3 id="room-name">{{ roomName }}</h3>
      <button class="btn btn-secondary" @click="logOut">Deconectează-te</button>
    </header>
    <main class="chat-main">
      <div id="chat-sidebar" class="chat-sidebar">
        <h3>
          <i class="fas fa-users"></i> Utilizatori <a class="btn btn-sm btn-secondary" href="/users" v-if="$store.state.user.role == 1"><i class="fas fa-pen"></i></a>
        </h3>
        <ul id="room-users">
          <li v-for="user in users" :key="user.id">
            {{ user.username }}
          </li>
        </ul>
      </div>
      <div class="chat-messages"></div>
    </main>
    <div class="chat-form-container">
      <div id="chat-form" class="input-group">
        <button id="btn-location" class="btn btn-success" type="button" style="border-radius: 0.25rem 0 0 0.25rem" data-toggle="tooltip" @click="sendLocation" data-placement="top" title="Send Location"><i class="fas fa-map"></i></button>

        <input type="text" id="msg" class="form-control" placeholder="Scrie un mesaj..." aria-label="Scrie un mesaj..." v-model="message" required autocomplete="off" />
        <button @click="sendMessage" class="btn btn-primary" id="ssendBtn" style="border-radius: 0 0.25rem 0.25rem 0"><i class="fas fa-paper-plane"></i> Trimite</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "chat",

  created() {
    if (this.$store.state.user != "") {
      this.$socket.client.emit("joinRoom", { username: this.$store.state.user.username, room: this.$store.state.user.room, role: this.$store.state.user.role });
    } else {
      window.location = "/login";
    }
  },

  data() {
    return {
      message: "",
      roomName: "",
      users: [],
      lat: 0,
      long: 0,
    };
  },

  // Fired when the Server sends data (io.functionName)
  sockets: {
    roomUsers(data) {
      this.users = data.users;
      this.roomName = data.room;
    },

    userLeave(data) {
      this.users = this.users.filter((user) => user.id != data.id);
    },
  },

  methods: {
    sendMessage() {
      if (this.message != "") {
        this.$socket.client.emit("chatMessage", this.message);
        this.message = "";
      }
    },
    logOut() {
      this.$store.commit("setLoggedInUser", "");
      this.$socket.client.disconnect();
      this.$router.push("/login");
    },
    sendLocation() {
      navigator.geolocation.getCurrentPosition(this.successFunction);
    },
    successFunction(position) {
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;

      this.$socket.client.emit("chatMessage", `<iframe width="800" height="200" style="border:0" loading="lazy" allowfullscreen src="https://www.google.com/maps/embed/v1/place?key=AIzaSyD7dvlUSM71t5nhC9-RdxB4dvKX6_gCXh8&q=${this.lat}, ${this.long}"></iframe>`);
    },
    goToSettings() {
      this.$socket.client.disconnect();
      this.$router.push("/settings");
    },
  },
};
</script>

<style>
.badge-primary {
  color: #fff !important;
  background-color: #007bff;
}

.badge-danger {
  color: #fff !important;
  background-color: #dc3545;
}
</style>
