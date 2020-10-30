<template>
    <div class="home">
        <header class="masthead text-center text-white">
            <div class="masthead-content">
                <div class="container" id="register">
                    <h1 class="register-title">S'inscrire</h1>
                    <form v-on:submit.prevent="login">
                        <div class="form-group">
                            <label for="exampleInputEmail1">Adresse email</label>
                            <input type="email" class="form-control" id="exampleInputEmail1"
                                   aria-describedby="emailHelp"
                                   placeholder="Entrez l'Email" v-model="credential.email"
                                   v-bind:class="{'is-invalid': invaliddata}"
                                   required>
                            <small id="emailHelp" class="form-text text-muted">Nous ne partagerons jamais votre
                                email.</small>
                        </div>
                        <div class="form-group">
                            <label for="inputPassword">Mot de Passe</label>
                            <input type="password" class="form-control" id="inputPassword" placeholder="Mot de Passe"
                                   v-model="credential.passwd" v-bind:class="{'is-invalid': invaliddata}" required>
                            <div class="invalid-feedback">
                                Le nom d'utilisateur ou le mot de passe sont incorrects
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary">Se Connecter</button>
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
                credential: {email: '', passwd: ''}
            }
        },
        methods: {
            login() {
                this.$emit('login', this.credential)
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

    @media (min-width: 992px) {
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

    @media (max-width: 700px) {
        #register {
            width: 100vw;
        }
    }
</style>
