<template>
  <div class="login-container">
    <div class="login-box">
      <header class="login-header">
        <h1>Login</h1>
      </header>
      <main class="login-main">
        <div class="alert alert-danger text-center" v-if="submitted && !success">Parola nu este corectă.<br /><br />Încearcă din nou.</div>
        <div>
          <label for="username">Nume de utilizator</label>
          <input type="text" name="username" id="username" class="form-control" placeholder="Introdu numele de utilizator aici" v-model="user.username" required />
        </div>
        <div>
          <label for="password">Parolă</label>
          <input type="password" name="password" id="password" class="form-control" placeholder="Introdu parola aici" v-model="user.password" required />
        </div>
        <div>
          <label for="room">Canal</label>
          <input type="room" name="room" id="room" class="form-control" placeholder="Introdu numele canalului aici" v-model="user.room" required />
        </div>
        <div class="row">
          <button @click="login" class="btn btn-block btn-success mb-2">Conectează-te</button>
          <router-link to="/register" class="btn btn-block btn-primary">Nu ai un cont? Înscrie-te!</router-link>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import UsersDataService from "../services/UsersDataService";

export default {
  name: "login",

  data() {
    return {
      user: {
        username: "",
        password: "",
        room: "",
      },
      submitted: false,
      success: false,
    };
  },

  mounted() {
    if (this.$store.state.user != "") {
      this.$router.push("/chat");
    }
  },

  methods: {
    login() {
      var data = {
        username: this.user.username,
        password: this.user.password,
        room: this.user.room,
      };

      UsersDataService.login(data)
        .then((response) => {
          this.submitted = true;
          if (response.data.length != 0) {
            this.success = true;
            this.$store.commit("setLoggedInUser", { ...response.data, room: this.user.room });
            //this.$router.push("/chat");
            window.location = "/chat";
          } else {
            this.success = false;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style></style>
