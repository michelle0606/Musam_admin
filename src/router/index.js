import Vue from 'vue'
import VueRouter from 'vue-router'
import Orders from '../views/Orders.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Orders',
    component: Orders
  }
]

const router = new VueRouter({
  routes
})

export default router
