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
      <a href="/chat" class="btn btn-info"
        >Înapoi la <strong>{{ $store.state.user.room }}</strong></a
      >
      <button class="btn btn-secondary btn-sm" @click="logOut">Deconectează-te</button>
    </header>
    <main class="chat-main">
      <div class="chat-messages">
        <div class="alert alert-success" v-if="success">{{ success }}</div>
        <div class="alert alert-danger" v-if="error">{{ error }}</div>
        <div v-if="currentUser">
          <h4>Editează-ți setările</h4>
          <hr />
          <div class="form-group mb-2">
            <label for="email"><strong>Adresa de email</strong></label>
            <input type="email" :class="{ 'form-control-plaintext': !editEnabled, 'form-control': editEnabled }" v-model="currentUser.email" :readonly="!editEnabled" id="email" />
          </div>
          <div class="form-group mb-2">
            <label for="username"><strong>Nume de utilizator</strong></label>
            <input type="text" :class="{ 'form-control-plaintext': !editEnabled, 'form-control': editEnabled }" id="username" :readonly="!editEnabled" v-model="currentUser.username" />
          </div>
          <div class="form-group mb-2" v-if="editEnabled">
            <label for="oldPassword"><strong>Parola veche</strong></label>
            <input type="password" class="form-control" id="oldPassword" v-model="oldPassword" />
          </div>
          <div class="form-group mb-2" v-if="editEnabled">
            <label for="password"><strong>Parola</strong></label>
            <input type="password" class="form-control" id="password" v-model="currentUser.password" />
          </div>
          <div class="form-group mb-2" v-if="editEnabled">
            <label for="passwordConfirmation"><strong>Confirmarea parolei</strong></label>
            <input type="password" class="form-control" id="passwordConfirmation" v-model="passwordConfirmation" />
          </div>
          <hr />
          <div class="row">
            <button class="btn btn-primary mb-2" @click="edit">{{ editEnabled ? "Salvează modificările" : "Editează" }}</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import UsersDataService from "../services/UsersDataService";

export default {
  name: "users-list",
  data() {
    return {
      currentUser: null,
      editEnabled: false,
      success: "",
      error: "",
      passwordConfirmation: "",
      oldPassword: "",
      oldStoredPassword: "",
    };
  },

  created() {
    if (this.$store.state.user == "") {
      this.$router.push("/login");
    }
  },

  mounted() {
    UsersDataService.get(this.$store.state.user.id)
      .then((response) => {
        this.currentUser = response.data;
      })
      .catch((e) => {
        console.log(e);
      });
  },

  methods: {
    updateUser() {
      UsersDataService.update(this.currentUser.id, this.currentUser)
        .then(() => {
          this.success = "Modificările au fost salvate cu succes!";
          this.$store.commit("setLoggedInUser", { ...this.currentUser, room: this.$store.state.user.room });
        })
        .catch((e) => {
          console.log(e);
        });
    },

    logOut() {
      this.$store.commit("setLoggedInUser", "");
      this.$socket.client.disconnect();
      this.$router.push("/login");
    },
    edit() {
      if (!this.editEnabled) {
        this.oldStoredPassword = this.currentUser.password;
        this.currentUser.password = "";
        this.passwordConfirmation = "";
        this.editEnabled = true;
      } else {
        this.error = "";
        this.success = "";
        if (this.currentUser.password != this.oldStoredPassword) this.error = "Parola veche nu este cea corectă. Încearcă din nou.";
        else if (!this.currentUser.password.length || !this.passwordConfirmation.length || !this.currentUser.username.length || !this.currentUser.email.length || !this.oldPassword.length) this.error = "Toate câmpurile sunt obligatorii.";
        else if (this.currentUser.password != this.passwordConfirmation) this.error = "Parolele nu se potrivesc. Încearcă din nou.";
        else {
          this.updateUser();
          this.editEnabled = false;
        }
      }
    },
    goToSettings() {
      this.$router.push("/settings");
    },
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
