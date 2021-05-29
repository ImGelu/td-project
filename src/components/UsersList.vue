<template>
  <div>
    <header class="chat-header">
      <i id="btn-sidebar" class="fas fa-bars"></i>
      <h3 id="room-name"></h3>
      <a href="index.html" class="btn btn-secondary">Leave Room</a>
    </header>
    <main class="chat-main">
      <div id="chat-sidebar" class="chat-sidebar">
        <h3><i class="fas fa-users"></i> Users</h3>
        <ul id="room-users"></ul>
      </div>
      <div class="chat-messages"></div>
    </main>
  </div>
</template>

<script>
import UsersDataService from "../services/UsersDataService";

export default {
  name: "users-list",
  data() {
    return {
      users: [],
      currentUser: null,
      currentIndex: -1,
      title: "",
    };
  },
  methods: {
    retrieveUsers() {
      UsersDataService.getAll()
        .then((response) => {
          this.users = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveUsers();
      this.currentUser = null;
      this.currentIndex = -1;
    },

    setActiveUser(user, index) {
      this.currentUser = user;
      this.currentIndex = user ? index : -1;
    },

    /*searchTitle() {
      TutorialDataService.findByTitle(this.title)
        .then((response) => {
          this.tutorials = response.data;
          this.setActiveTutorial(null);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },*/
  },
  mounted() {
    this.retrieveUsers();
  },
};
</script>

<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
</style>
