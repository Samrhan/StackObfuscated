<template>
  <div class="home">
    <header class="masthead text-center text-white">
      <div class="masthead-content">
        <div class="container" id="register">
          <h1 class="register-title">S'inscrire</h1>
          <form v-on:submit.prevent="register">
            <div class="form-group">
              <label for="exampleInputEmail1">Adresse email</label>
              <input type="email" class="form-control" id="exampleInputEmail1"
                     aria-describedby="emailHelp"
                     placeholder="Entrez l'Email" v-model="email.input"
                     v-bind:class="{'is-invalid': email.invalid || $store.state.status === 2}" required>
              <div class="invalid-feedback" v-if="email.invalid">
                Le format ne correspond pas à une email
              </div>
              <div class="invalid-feedback" v-else>
                L'email est déjà enregistré
              </div>
              <small id="emailHelp" class="form-text text-muted">Nous ne partagerons jamais votre
                email.</small>
            </div>
            <div class="form-group">
              <label for="exampleInputEmail1">Adresse email</label>
              <input type="text" class="form-control" id="inputUsername"
                     aria-describedby="usernameHelp"
                     placeholder="Entrez un nom d'utilisateur" v-model="username.input"
                     v-bind:class="{'is-invalid': username.invalid || $store.state.status === 4}" required>
              <div class="invalid-feedback" v-if="username.invalid">
                Votre nom d'utilisateur doit faire plus de 5 caractères et ne contenir que des lettres ou des chiffres
              </div>
              <div class="invalid-feedback" v-else>
                Nom d'utilisateur déjà utilisé
              </div>
            </div>
            <div class="form-group">
              <div>
                <label for="inputPassword">Mot de Passe</label>
                <input type="password" class="form-control" id="inputPassword"
                       placeholder="Mot de Passe"
                       v-model="password.input" v-bind:class="{'is-invalid': password.invalid}"
                       required>
                <div class="invalid-feedback">
                  Le mot de passe doit contenir au moins une majuscule, un chiffre, et dois faire au
                  moins 8 caractères
                </div>
              </div>
              <div>
                <label for="inputConfirmPassword">Confirmez le Mot de Passe</label>
                <input type="password" class="form-control"
                       v-bind:class="{'is-invalid': confirmPassword.invalid}"
                       id="inputConfirmPassword" placeholder="Confirmation"
                       v-model="confirmPassword.input" required>
                <div class="invalid-feedback">
                  Les deux mots de passes sont différents
                </div>
              </div>
            </div>
            <button type="submit" class="btn btn-primary">S'inscrire</button>
          </form>
        </div>
      </div>
      <div class="bg-circle-1 bg-circle"></div>
      <div class="bg-circle-2 bg-circle"></div>
      <div class="bg-circle-3 bg-circle"></div>
      <div class="bg-circle-4 bg-circle"></div>
    </header>
  </div>
</template>

<script>
export default {
  props: {
    invaliddata: {type: Boolean, default: false}
  },
  data() {
    return {
      email: {input: '', invalid: false},
      password: {input: '', invalid: false},
      username: {input: '', invalid: false},
      confirmPassword: {input: '', invalid: false},
    }
  },
  methods: {
    register() {
      // On fait une petite confirmation des données
      this.password.invalid = !this.password.input.match(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/)
      this.confirmPassword.invalid = this.confirmPassword.input !== this.password.input;
      this.email.invalid = !this.email.input.match(/.*@.*\..{2,}/);
      this.username.invalid = (this.username.input.length < 5) || (!!this.username.input.match(/[^A-Za-z0-9 _]+/));
      let validForm = !this.password.invalid && !this.email.invalid && !this.confirmPassword.invalid && !this.username.invalid
      if (validForm) {
        this.$store.dispatch('register', {
          email: this.email.input,
          passwd: this.password.input,
          username: this.username.input
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

h1, h2, h3, h4, h5, h6 {
  font-family: 'Avenir Heavy', serif;
  font-weight: 800 !important;
}

header.masthead {
  position: relative;
  overflow: hidden;
  background: linear-gradient(0deg, #ff6a00 0%, #ee0979 100%) no-repeat scroll center center;
  background-size: cover;
  min-height: 100vh;
}

header.masthead .masthead-content {
  z-index: 1;
  position: relative;
}

header.masthead .bg-circle {
  z-index: 0;
  position: absolute;
  border-radius: 100%;
  background: linear-gradient(0deg, #ee0979 0%, #ff6a00 100%);
}

header.masthead .bg-circle-1 {
  height: 90rem;
  width: 90rem;
  bottom: -55rem;
  left: -55rem;
}

header.masthead .bg-circle-2 {
  height: 50rem;
  width: 50rem;
  top: -25rem;
  right: -25rem;
}

header.masthead .bg-circle-3 {
  height: 20rem;
  width: 20rem;
  bottom: -10rem;
  right: 5%;
}

header.masthead .bg-circle-4 {
  height: 30rem;
  width: 30rem;
  top: -5rem;
  right: 35%;
}

@media (min-width: 1000px) {
  header.masthead {
    padding-top: 15vh;
    padding-bottom: 10rem;
  }
}

.btn-primary {
  background-color: #ee0979;
  border-color: #ee0979;
}

.btn-primary:active, .btn-primary:focus, .btn-primary:hover {
  background-color: #bd0760 !important;
  border-color: #bd0760 !important;
}

.btn-primary:focus {
  box-shadow: 0 0 0 0.2rem rgba(238, 9, 121, 0.5);
}

#register {
  width: 30vw;
  background-color: white;
  padding: 15px;
  background-clip: padding-box;
  border: solid 2px transparent; /* !importanté */
  border-radius: 1em;

}

#register:before {
  content: '';
  position: absolute;
  top: -1vh;
  right: calc(35vw - 15px);
  bottom: -1vh;
  left: calc(35vw - 15px);
  z-index: -1;
  padding: 15px;
  border-radius: inherit; /* !importanté */
  background: linear-gradient(0deg, #ee0979 0%, #ff6a00 100%);
}

.register-title {
  text-align: center;
  color: black
}

@media (max-width: 1000px) {
  #register {
    width: 100vw;
    margin-top: 20vh;
  }
}
</style>
