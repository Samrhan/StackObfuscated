<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
      <a class="navbar-brand">
        <router-link class="router-link float-left" to="/" v-bind:style="{fontSize:'15px'}">Stack\u004fbfuscated
        </router-link>
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar"
              aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbar">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <a class="nav-link">
              <router-link class="router-link" :to="{name:'home'}">Home
              </router-link>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link">
              <router-link class="router-link" :to="{name:'forum'}">Forum
              </router-link>
            </a>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0" v-on:submit.prevent="search">
          <input class="form-control mr-sm-2 col-lg-100" type="search" placeholder="Recherche un tag"
                 aria-label="Search"
                 v-model="input_search">
        </form>
        <ul class="navbar-nav my-2 my-lg-0" v-if="!$store.state.user">
          <li class="nav-item">
            <a class="nav-link">
              <router-link class="router-link" :to="{name:'login'}">Se Connecter</router-link>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link">
              <router-link class="router-link" :to="{name:'register'}">S'Inscrire</router-link>
            </a>
          </li>
        </ul>
        <ul class="navbar-nav my-2 my-lg-0" v-else>
          <li class="nav-item">
            <a class="nav-link">
              <a class="router-link"
                 :href="$router.resolve({name: 'profile', params:{username:this.$store.state.user.username}}).href">Profil</a>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link">
              <a class="router-link" v-on:click="$store.dispatch('logout')">Se déconnecter</a>
            </a>
          </li>
        </ul>
      </div>
    </nav>
    <router-view></router-view>
    <footer class="py-5">
      <div class="container">
        <p class="m-0 text-center text-white small">Copyright © StackObfuscated.com 2020</p>
      </div>
    </footer>
    <div class="fixed-bottom container-cookie align-baseline" tabindex="-1" role="dialog"
         aria-hidden="false" v-if="!cookie">
      <div class="notice d-flex justify-content-between align-items-center">
        <div class="cookie-text float-left">Nous utilisons seulement les cookies nécessaires à votre navigation sur ce
          site, et ne collectons aucune données de navigation.
        </div>
        <div class="buttons d-flex flex-column flex-lg-row cookie-buttons float-right">
          <a class="btn btn-success btn-sm" v-on:click="acceptCookies">J'accepte</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      input_search: '',
      cookie: this.$cookies.get('accept-cookies'),
    }
  },
  methods: {
    search: function () {
      this.$router.replace({name: 'tagpage', params: {tag_name: this.input_search}})
    },
    async acceptCookies() {
      await this.$store.dispatch('accept_cookies')
      this.cookie = this.$cookies.get('accept-cookies')

    }
  },
  async mounted() {
    if (this.$route.name !== 'profile') // on charge déjà me au mounted de la page profile
      await this.$store.dispatch('me')
  }
}
</script>

<style>
@font-face {
  font-family: Avenir Black;
  src: url(assets/fonts/AvenirBlack.otf) format("opentype");
  font-weight: 400;
}

@font-face {
  font-family: Avenir Book;
  src: url(assets/fonts/AvenirBook.otf) format("opentype");
  font-weight: 400;
}

@font-face {
  font-family: Avenir Heavy;
  src: url(assets/fonts/AvenirHeavy.otf) format("opentype");
  font-weight: 400;
}

@font-face {
  font-family: Avenir Light;
  src: url(assets/fonts/AvenirLight.otf) format("opentype");
  font-weight: 400;
}

@font-face {
  font-family: Avenir Medium;
  src: url(assets/fonts/AvenirMedium.otf) format("opentype");
  font-weight: 400;
}

@font-face {
  font-family: Avenir Roman;
  src: url(assets/fonts/AvenirRoman.otf) format("opentype");
  font-weight: 400;
}

@font-face {
  font-family: ProximaNova;
  src: url(assets/fonts/ProximaNovaRegular.otf) format("opentype");
  font-weight: 400;
}

@font-face {
  font-family: ProximaNova Bold;
  src: url(assets/fonts/ProximaNovaBold.otf) format("opentype");
  font-weight: 400;
}

@font-face {
  font-family: ProximaNova Semibold;
  src: url(assets/fonts/ProximaNovaSemibold.otf) format("opentype");
  font-weight: 400;
}

@font-face {
  font-family: ProximaNova Light;
  src: url(assets/fonts/ProximaNovaLight.otf) format("opentype");
  font-weight: 400;
}

body {
  overflow-x: hidden;
}

.navbar-custom {
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: rgba(0, 0, 0, 0.7);
}

.navbar-custom .navbar-brand {
  text-transform: uppercase;
  font-size: 1rem;
  letter-spacing: 0.1rem;
  font-weight: 700;
}

.navbar-custom .navbar-nav .nav-item .nav-link {
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1rem;
}

.router-link {
  cursor: pointer;
  color: white;
}

.router-link-exact-active {
  text-decoration: underline;
}

.navbar-custom {
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: rgba(0, 0, 0, .7);
}

footer {
  background-color: black !important;
  width: 100%;
}

.container-cookie {
  background: rgba(0, 0, 0, 0.8);
  min-height: 50px;
  color: white;
  padding-top: 8px;
  padding-left: 8px;
  padding-right: 8px;
}

.cookie-buttons a {
  margin-left: 8px;
}

body::-webkit-scrollbar-track /* Pour la barre de scroll */
{
  background-color: black;
}

body::-webkit-scrollbar {
  width: 13px;
  background-color: black;
}

body::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  background-color: #F5F5F5;
}

</style>
