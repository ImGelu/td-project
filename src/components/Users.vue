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
      <div id="chat-sidebar" class="chat-sidebar">
        <h3><i class="fas fa-users"></i> Utilizatori</h3>
        <div class="input-group mb-3">
          <input type="text" class="form-control" placeholder="Caută după numele de utilizator" v-model="name" />
          <div class="input-group-append">
            <button class="btn btn-success" type="button" @click="searchUser">
              Caută
            </button>
          </div>
        </div>
        <ul class="list-group">
          <li class="list-group-item p-3" style="cursor: pointer;" :class="{ active: index == currentIndex }" v-for="(user, index) in users" :key="index" @click="setActiveUser(user, index)">
            {{ user.username }}
          </li>
        </ul>
      </div>
      <div class="chat-messages">
        <div class="alert alert-success" v-if="success">{{ success }}</div>
        <div class="alert alert-danger" v-if="error">{{ error }}</div>
        <div v-if="currentUser">
          <h4>Utilizator</h4>
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
            <label for="password"><strong>Parola</strong></label>
            <input type="password" class="form-control" id="password" v-model="currentUser.password" />
          </div>
          <div class="form-group mb-2" v-if="editEnabled">
            <label for="passwordConfirmation"><strong>Confirmarea parolei</strong></label>
            <input type="password" class="form-control" id="passwordConfirmation" v-model="passwordConfirmation" />
          </div>
          <div class="form-group mb-2">
            <label for="role"><strong>Rol</strong></label>
            <select class="form-control" v-model="currentUser.role" v-if="editEnabled">
              <option value="0">Utilizator normal</option>
              <option value="1">Administrator</option>
            </select>
            <input type="text" :class="{ 'form-control-plaintext': !editEnabled, 'form-control': editEnabled }" id="role" :readonly="!editEnabled" :value="currentUser.role == 1 ? 'Administrator' : 'Utilizator normal'" v-if="!editEnabled" />
          </div>
          <hr />
          <div class="row">
            <button class="btn btn-primary mb-2" @click="edit">{{ editEnabled ? "Salvează modificările" : "Editează" }}</button>
            <button class="btn btn-danger" @click="deleteUser" v-if="editEnabled">Șterge utilizatorul</button>
          </div>
        </div>
        <div v-else>
          <br />
          <p>Alege un utilizator pentru a-i edita datele</p>
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
      users: [],
      currentUser: null,
      editEnabled: false,
      currentIndex: -1,
      name: "",
      success: "",
      error: "",
      passwordConfirmation: "",
    };
  },

  created() {
    if (this.$store.state.user.role != 1) {
      this.$router.push("/login");
    }
  },

  methods: {
    retrieveUsers() {
      UsersDataService.findAll()
        .then((response) => {
          this.users = response.data;
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
      this.error = "";
      this.success = "";
      this.editEnabled = false;
      this.currentUser = user;
      this.currentIndex = user ? index : -1;
      this.currentUser.password = "";
    },

    updateUser() {
      UsersDataService.update(this.currentUser.id, this.currentUser)
        .then(() => {
          this.success = "Modificările au fost salvate cu succes!";
        })
        .catch((e) => {
          console.log(e);
        });
    },

    deleteUser() {
      if (confirm("Ești sigur că vrei să ștergi acest utilizator?")) {
        UsersDataService.delete(this.currentUser.id)
          .then(() => {
            this.setActiveUser(null);
            this.success = "Utilizatorul a fost șters cu succes!";
            this.refreshList();
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },

    searchUser() {
      this.error = "";
      this.success = "";
      UsersDataService.findAll(this.name)
        .then((response) => {
          this.users = response.data;
          this.setActiveUser(null);
          if (!this.users.length) this.error = "Nu s-au găsit utilizatori cu acel nume";
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
        this.passwordConfirmation = "";
        this.editEnabled = true;
      } else {
        this.error = "";
        this.success = "";
        if (!this.currentUser.password.length || !this.passwordConfirmation.length || !this.currentUser.username.length || !this.currentUser.email.length) this.error = "Toate câmpurile sunt obligatorii.";
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
