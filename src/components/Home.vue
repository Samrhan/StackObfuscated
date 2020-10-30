<template>
    <div class="home">
        <header class="masthead text-center text-white">
            <div class="masthead-content">
                <div class="container">
                    <h1 class="masthead-heading mb-0">Stack\u004fbfuscated</h1>
                    <h2 class="masthead-subheading mb-0">Ugly code is Beautif\x75l</h2>
                    <a href="#" class="btn btn-primary btn-xl rounded-pill mt-5">Learn More</a>
                </div>
            </div>
            <div class="bg-circle-1 bg-circle"></div>
            <div class="bg-circle-2 bg-circle"></div>
            <div class="bg-circle-3 bg-circle"></div>
            <div class="bg-circle-4 bg-circle"></div>
        </header>
        <div id="page-content" class="row" v-bind:style="{marginTop:'15px'}">
            <div class="col-4 p-5">
                <h2 class="display-4">Last Thread</h2></div>
            <div id="latest-post" class="col-8">
                <div class="container-fluid mt-100">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card mb-4">
                                <div class="card-header">
                                    <div class="media flex-wrap w-100 align-items-center">
                                        <div class="media-body ml-3"><a href="javascript:void(0)"
                                                                        data-abc="true">Dave</a>
                                            <div class="text-muted small">13 days ago</div>
                                        </div>
                                        <div class="text-muted small ml-3">
                                            <div><strong>5</strong> ⭐</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <p> Bonjour à tous ! Je suis nouveau, comment faire un print Hello World en x86
                                        Assembly ?</p>
                                </div>
                                <div class="card-footer d-flex justify-content-between align-items-center px-0 pt-0 pb-3">
                                    <div class="px-4 pt-3"><a class="text-muted">
                                        <span class="align-middle">445 Answers</span></a>
                                    </div>
                                    <div class="px-4 pt-3">
                                        <button type="button" class="btn btn-primary"><i class="ion ion-md-create"></i>&nbsp;
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Home',
        props: {
            msg: String
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

    h1, h2, h3, h4, h5, h6 {
        font-family: 'Avenir Heavy', serif;
        font-weight: 800 !important;
    }

    .btn-xl {
        text-transform: uppercase;
        padding: 1.5rem 3rem;
        font-size: 0.9rem;
        font-weight: 700;
        letter-spacing: 0.1rem;
    }

    .rounded-pill {
        border-radius: 5rem;
    }


    header.masthead {
        position: relative;
        overflow: hidden;
        padding-top: calc(7rem + 72px);
        padding-bottom: 7rem;
        background: linear-gradient(0deg, #ff6a00 0%, #ee0979 100%) no-repeat scroll center center;
        background-size: cover;
        min-height: 100vh;
    }

    header.masthead .masthead-content {
        z-index: 1;
        position: relative;
    }

    header.masthead .masthead-content .masthead-heading {
        font-size: 4rem;
    }

    header.masthead .masthead-content .masthead-subheading {
        font-size: 2rem;
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
            padding-top: calc(10rem + 55px);
            padding-bottom: 10rem;
        }

        header.masthead .masthead-content .masthead-heading {
            font-size: 6rem;
        }

        header.masthead .masthead-content .masthead-subheading {
            font-size: 4rem;
        }
    }

    .bg-primary {
        background-color: #ee0979 !important;
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

    .btn-secondary {
        background-color: #ff6a00;
        border-color: #ff6a00;
    }

    .btn-secondary:active, .btn-secondary:focus, .btn-secondary:hover {
        background-color: #cc5500 !important;
        border-color: #cc5500 !important;
    }

    .btn-secondary:focus {
        box-shadow: 0 0 0 0.2rem rgba(255, 106, 0, 0.5);
    }
</style>
