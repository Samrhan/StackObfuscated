import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App.vue'
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import Profile from './components/Profile'
import axios from 'axios'


Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(require('vue-moment'));

Vue.config.productionTip = false

const routes = [
    {path: '/', redirect: '/home'},
    {path: '/home', component: Home, name: 'home'},
    {path: '/register', component: Register, name: 'register'},
    {path: '/login', component: Login, name: 'login'},
    {path: '/profile/:username', component: Profile, name: 'profile'}

]

const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})


//to handle state
const state = {
    status: 0,
    user: undefined,
    tmp_user: undefined,
    post_list: []
}

//to handle state
const getters = {}

//to handle actions
const actions = {
    me: async ({commit}) => {
        await axios.get('/api/me')
            .then(response => {
                if (response.data.user) {
                    commit('SET_STATUS', 100)
                    commit('SET_USER', response.data.user)
                }
            })
    },
    register: ({commit}, form) => {
        axios.post('/api/register', form)
            .then(response => {
                commit('SET_USER', response.data.user)
                commit('SET_STATUS', 100)
                router.replace('/home')
            }).catch(err => {
            commit('SET_STATUS', err.response.data.code)
        })
    },
    login: ({commit}, form) => {
        axios.post('/api/login', form)
            .then(response => {
                commit('SET_USER', response.data.user)
                commit('SET_STATUS', 100)
                router.replace('/home')
            }).catch(err => {
            commit('SET_STATUS', err.response.data.code)
        })
    },
    logout: ({commit}) => {
        axios.post('/api/logout')
            .then(() => {
                commit('SET_USER', undefined)
            })
    },
    edit: async ({commit}, user) => {
        await axios.post('/api/editprofile', user)
            .then(response => {
                commit('SET_USER', response.data.user)
            })
    },
    get_user: async ({commit}, user) => {
        await axios.get('/api/user/' + user)
            .then(response => {
                let user = response.data.user
                user.username = user
                commit('SET_TMP_USER', user)
            })
    },
    fetch_post: async ({commit}, user) => {
        await axios.get('/api/post/' + user)
            .then(response => {
                commit('SET_POST_LIST', response.data.list)
            })
    },
    submit_post: async ({commit}, post) => {
        await axios.post('/api/post', post)
            .then(response => {
                commit('ADD_POST', response.data.post)
            })

    },
    delete_post: async ({commit}, id) => {
        await axios.delete('/api/post/' + id)
            .then(response => {
                commit('DELETE_POST', response.data.id)
            })
    }
}

//to handle mutations
const mutations = {
    SET_STATUS(state, status) {
        state.status = status
    },
    SET_USER(state, user) {
        state.user = user
    },
    SET_TMP_USER(state, user) {
        state.tmp_user = user
    },
    ADD_POST(state, post) {
        state.post_list.push(post)
    },
    SET_POST_LIST(state, list) {
        state.post_list = list
    },
    DELETE_POST(state, id) {
        for (let i = 0; i < state.post_list.length; i++) {
            if (state.post_list[i].id === parseInt(id)) {
                state.post_list = state.post_list.splice(i, 1)
            }
        }
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

