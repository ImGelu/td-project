<template>
  <div class="login-container">
    <div class="login-box">
      <header class="login-header">
        <h1>Înregistrare</h1>
      </header>
      <main class="login-main">
        <div v-if="!submitted">
          <div class="alert alert-success" v-if="success">{{ success }}</div>
          <div class="alert alert-danger" v-if="error">{{ error }}</div>
          <div class="form-group">
            <label for="email">Adresa de e-mail</label>
            <input type="text" class="form-control" id="email" required v-model="user.email" name="email" />
          </div>

          <div class="form-group">
            <label for="username">Numele de utilizator</label>
            <input class="form-control" id="username" required v-model="user.username" name="username" />
          </div>

          <div class="form-group">
            <label for="password">Parola</label>
            <input type="password" class="form-control" id="password" required v-model="user.password" name="password" />
          </div>

          <div class="form-group">
            <label for="passwordConfirmation">Confirmarea parolei</label>
            <input type="password" class="form-control" id="passwordConfirmation" v-model="passwordConfirmation" />
          </div>

          <div class="row">
            <button @click="saveUser" class="btn btn-block btn-success mb-2">Creează contul</button>
            <router-link to="/login" class="btn btn-block btn-primary">Mergi înapoi la pagina de conectare</router-link>
          </div>
        </div>

        <div v-else>
          <h4>Contul a fost creat cu succes!</h4>
          <router-link to="/login" class="btn btn-success">Mergi înapoi la pagina de conectare</router-link>
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
      passwordConfirmation: "",
      error: "",
      success: "",
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

      this.error = "";
      this.success = "";

      if (!data.password.length || !this.passwordConfirmation.length || !data.username.length || !data.email.length) this.error = "Toate câmpurile sunt obligatorii.";
      else if (this.user.password != this.passwordConfirmation) this.error = "Parolele nu se potrivesc. Încearcă din nou.";
      else {
        UsersDataService.create(data)
          .then((response) => {
            this.user.id = response.data.id;
            this.submitted = true;
          })
          .catch((e) => {
            console.log(e);
          });
      }
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
