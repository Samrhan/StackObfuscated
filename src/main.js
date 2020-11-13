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
import About from './components/Aboutus'


import VueCookies from 'vue-cookies'

import axios from 'axios'


Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(require('vue-moment'));
Vue.use(VueCookies)


Vue.config.productionTip = false

const routes = [
    {path: '/', redirect: '/home'},
    {path: '/home', component: Home, name: 'home'},
    {path: '/register', component: Register, name: 'register'},
    {path: '/login', component: Login, name: 'login'},
    {path: '/profile/:username', component: Profile, name: 'profile'},
    {path: '/forum', component: Forum, name: 'forum'},
    {path: '/forum/tag/:tag_name', component: TagPage, name: 'tagpage'},
    {path: '/forum/popular', component: TagPage, name: 'popular'},
    {path: '/forum/last', component: TagPage, name: 'last'},
    {path: '/forum/post/:post_id', component: Post, name: 'post'},
    {path: '/about', component: About, name: 'about'},
    {path: '**', redirect: '/home'}

]

const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})


//to handle state
const state = {
    status: 0, // Codes d'erreur, Permet d'afficher les erreurs du serveur au bon endroit
    user: undefined, // Utilisateur Actuel
    tmp_user: undefined, // Liste d'utilsateur en cache
    post_list: [], // Liste de post
    popular_tags: [], // Tag populaires
    tag_number: 0, // Nombre de tag total
    tags_posts: [], // Posts du tag sélectionné
    tags_posts_number: 0, // Nombre de post par tag
    username_to_id: {} // Permet de retrouver le nom d'utilsateur avec un id
}

//to handle state
const getters = {} // Je crois qu'on a mal utilisé ça :/

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
                router.push({name: 'home'})
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
            }).catch(() => commit('SET_TMP_USER', undefined))
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
    delete_post: async ({commit}, data) => {
        await axios.delete('/api/post/' + data.id)
            .then(() => {
                commit('DELETE_POST', data.index)
            })
    },
    popular_tags: async ({commit}, start) => {
        await axios.get('/api/tags/popular/' + start)
            .then(response => {
                commit('SET_POPULAR_TAGS', response.data)
            })
    },
    get_tag_post: async ({commit}, payload) => {
        if (payload.name === 'popular')
            await axios.get('/api/posts/popular/' + payload.start)
                .then(response => {
                    commit('SET_TAG_POST_LIST', response.data)
                }).catch(() => {
                })
        else if (payload.name === 'last')
            await axios.get('/api/posts/last/' + payload.start)
                .then(response => {
                    commit('SET_TAG_POST_LIST', response.data)
                }).catch(() => {
                })
        else await axios.get('/api/tags/posts/' + payload.start + '/' + payload.name)
            .then(response => {
                commit('SET_TAG_POST_LIST', response.data)
            }).catch(() => {
            })
    },
    like_post: async ({commit}, post_id) => {
        await axios.put('/api/like/' + post_id)
            .then(response => {
                // On vérifie que du côté du back si c'est un like ou un dislike, pour éviter les conflits
                if (response.data.action === 'like')
                    commit('LIKE_POST', post_id)
                else if (response.data.action === 'dislike')
                    commit('DISLIKE_POST', post_id)
            })
    },
    comment_post: async ({commit}, data) => {
        await axios.post('/api/comment/' + data.id, {content: data.content})
            .then(response => {
                commit('COMMENT_POST', response.data.answer)
                commit('SET_STATUS', 100)
            }).catch(err=>{
                if(err.response.data.code === 10){
                    commit('SET_STATUS', 10)
                }
            })
    },
    delete_comment: async ({commit}, comment_id) => {
        await axios.delete('/api/comment/' + comment_id)
            .then(response => {
                commit('DELETE_COMMENT', response.data.data)
            })
    },
    accept_cookies: async ()=>{
        await axios.post('/api/acceptcookies')
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
        if (user !== undefined) {
            if (!state.tmp_user)
                state.tmp_user = {}
            state.tmp_user[user.id] = user
            state.username_to_id[user.username] = user.id
        }
    },
    ADD_POST(state, post) {
        state.post_list.unshift(post)
    },
    SET_POST_LIST(state, list) {
        state.post_list = list
    },
    DELETE_POST(state, index) {
        state.post_list.splice(index, 1)
    },
    SET_POPULAR_TAGS(state, data) {
        state.popular_tags = data.tags
        state.tag_number = data.number
    },
    SET_TAG_POST_LIST(state, data) {
        state.tags_posts = data.posts
        state.tags_posts_number = data.number
    },
    LIKE_POST(state, post_id) {
        let post = state.post_list.find(post => post.id === post_id)
        if (post) {
            post.liked = true
            post.likes += 1
        }
    },
    DISLIKE_POST(state, post_id) {
        let post = state.post_list.find(post => post.id === post_id)
        if (post) {
            post.liked = false
            post.likes -= 1
        }
    },
    COMMENT_POST(state, data) {
        let post = state.post_list.find(post => post.id === data.post_id)
        if (post) {
            if (!post.comments)
                post.comments = []
            post.comments.push(data)
            post.responses = parseInt(post.responses) + 1
        }
    },
    DELETE_COMMENT(state, data) {
        let post = state.post_list.find(post => post.id === data.post_id)
        if (post) {
            let index = post.comments.indexOf(post.comments.find(comment => comment.id === data.id))
            post.comments.splice(index, 1)
            post.responses -= 1
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

