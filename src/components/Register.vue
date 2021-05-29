<template>
  <div class="login-container">
    <div class="login-box">
      <header class="login-header">
        <h1>Register</h1>
      </header>
      <main class="login-main">
        <div v-if="!submitted">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="text" class="form-control" id="email" required v-model="user.email" name="email" />
          </div>

          <div class="form-group">
            <label for="username">Username</label>
            <input class="form-control" id="username" required v-model="user.username" name="username" />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input class="form-control" id="password" required v-model="user.password" name="password" />
          </div>

          <div class="row">
            <button @click="saveUser" class="btn btn-block btn-success mb-2">Sign up</button>
            <router-link to="/login" class="btn btn-block btn-primary">Go back to the login page</router-link>
          </div>
        </div>

        <div v-else>
          <h4>The account has been successfully created!</h4>
          <router-link to="/login" class="btn btn-success">Go to the Login page</router-link>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import UsersDataService from "../services/UsersDataService";

export default {
  name: "add-user",
  data() {
    return {
      user: {
        id: null,
        email: "",
        username: "",
        password: "",
      },
      submitted: false,
    };
  },

  mounted() {
    if (this.$store.state.user != "") {
      this.$router.push("/chat");
    }
  },

  methods: {
    saveUser() {
      var data = {
        email: this.user.email,
        username: this.user.username,
        password: this.user.password,
      };

      UsersDataService.create(data)
        .then((response) => {
          this.user.id = response.data.id;
          this.submitted = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style>
.submit-form {
  max-width: 300px;
  margin: auto;
}
</style>
