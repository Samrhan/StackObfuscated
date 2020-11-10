import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App.vue'
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import Profile from './components/Profile'
import Forum from './components/Forum'
import TagPage from './components/forum/tag_page'
import Post from './components/forum/Post'

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
    {path: '/profile/:username', component: Profile, name: 'profile'},
    {path: '/forum', component: Forum, name: 'forum'},
    {path: '/forum/tag/:tag_name', component: TagPage, name: 'tagpage'},
    {path: '/forum/post/:post_id', component: Post, name: 'post'}

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
    post_list: [],
    popular_tags: [],
    tag_number: 0,
    tags_posts: [],
    tags_posts_number: 0,
    username_to_id: {}
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
                commit('SET_TMP_USER', user)
            })
    },
    fetch_posts: async ({commit}, user) => {
        await axios.get('/api/posts/' + user)
            .then(response => {
                commit('SET_POST_LIST', response.data.list)
            })
    },
    fetch_post: async ({commit}, post_id) => {
        await axios.get('/api/post/' + post_id)
            .then(response => {
                commit('SET_POST_LIST', [response.data.post])
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
    },
    popular_tags: async ({commit}, start) => {
        await axios.get('/api/tags/popular/' + start)
            .then(response => {
                commit('SET_POPULAR_TAGS', response.data)
            })
    },
    get_tag_post: async ({commit}, payload) => {
        await axios.get('/api/tags/posts/' + payload.start + '/' + payload.name)
            .then(response => {
                commit('SET_TAG_POST_LIST', response.data)
            }).catch(()=>{})
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
        // Crée une liste d'utilisateur en cache
        if (!state.tmp_user)
            state.tmp_user = {}
        state.tmp_user[user.id] = user
        state.username_to_id[user.username] = user.id
    },
    ADD_POST(state, post) {
        state.post_list.unshift(post)
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
    },
    SET_POPULAR_TAGS(state, data) {
        state.popular_tags = data.tags
        state.tag_number = data.number
    },
    SET_TAG_POST_LIST(state, data) {
        state.tags_posts = data.posts
        state.tags_posts_number = data.number
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

