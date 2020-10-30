import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'


Vue.use(VueRouter)
Vue.config.productionTip = false

const routes = [
  {path: '/', redirect: '/home' },
  { path: '/home', component: Home },
  {path : '/register', component: Register},
  {path : '/login', component: Login}

]

const router = new VueRouter({
  mode: 'history',
  routes // short for `routes: routes`
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
