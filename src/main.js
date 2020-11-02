import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App.vue'

import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import axios from 'axios'


Vue.use(VueRouter)
Vue.use(Vuex)
Vue.config.productionTip = false

const routes = [
    {path: '/', redirect: '/home'},
    {path: '/home', component: Home},
    {path: '/register', component: Register},
    {path: '/login', component: Login}

]

const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})


//to handle state
const state = {
    status: 0,
    user: {}
}

//to handle state
const getters = {}

//to handle actions
const actions = {
    register: ({commit}, form) => {
        axios.post('/api/register', form)
            .then(response => {
                commit('SET_USER', response.data.user)
                commit('SET_STATUS', 100)
            }).catch(err => {
            commit('SET_STATUS', err.response.data.code)
        })
    },
    login: ({commit}, form) => {
        axios.post('/api/login', form)
            .then(response => {
                commit('SET_USER', response.data.user)
                commit('SET_STATUS', 100)
            }).catch(err => {
            commit('SET_STATUS', err.response.data.code)
        })
    },
}

//to handle mutations
const mutations = {
    SET_STATUS(state, status) {
        state.status = status
    },
    SET_USER(state, user){
        state.user = user
        router.replace('/home')
    }
}

const store = new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')

