<template>
    <div id="app">
        <nav class="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
            <a class="navbar-brand">
                <router-link class="router-link" to="/">Stack\u004fbfuscated</router-link>
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <a class="nav-link">
                            <router-link class="router-link" to="home">Home</router-link>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link">
                            <router-link class="router-link" to="home">Forum</router-link>
                        </a>
                    </li>
                </ul>
                <form class="form-inline my-2 my-lg-0" v-on:submit.prevent="test">
                    <input class="form-control mr-sm-2 col-lg-100" type="search" placeholder="Search" aria-label="Search">
                </form>
                <ul class="navbar-nav my-2 my-lg-0">
                    <li class="nav-item">
                        <a class="nav-link">
                            <router-link class="router-link" to="login">Login</router-link>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link">
                            <router-link class="router-link" to="register">Register</router-link>
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

    </div>
</template>

<script>
    module.exports = {
        methods:{
            test: function(){
                console.log("test");
            }
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

    body{
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

    .router-link{
        cursor: pointer;
        color: white;
    }

    .router-link-exact-active{
        text-decoration: underline;
    }
    .navbar-custom {
        padding-top: 1rem;
        padding-bottom: 1rem;
        background-color: rgba(0,0,0,.7);
    }

    footer{
        background-color: black !important;
    }
</style>
