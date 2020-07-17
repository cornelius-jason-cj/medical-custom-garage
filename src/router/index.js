import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home'
import Invoice from '@/views/invoice'
import StockItems from '@/views/stockItems'
import Login from '@/views/login'
import store from '@/store'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    beforeEnter (to, from, next) {
      if (store.state.auth.user.isAuthenticated) {
        next ()
      } else {
        next ({name: 'login'})
      }
    }
  },
  {
    path: '/invoice',
    name: 'invoice',
    component: Invoice,
    beforeEnter (to, from, next) {
      if (store.state.auth.user.isAuthenticated) {
        next ()
      } else {
        next ({name: 'login'})
      }
    }
  },
  {
    path: '/stockItems',
    name: 'stockItems',
    component: StockItems,
    beforeEnter (to, from, next) {
      if (store.state.auth.user.isAuthenticated) {
        next ()
      } else {
        next ({name: 'login'})
      }
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
