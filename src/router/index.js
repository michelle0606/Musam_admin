import Vue from 'vue'
import VueRouter from 'vue-router'
import Orders from '../views/Orders.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'orders',
    component: Orders
  },
  {
    path: '/order/create',
    name: 'create-order',
    component: Orders
  },
  {
    path: '/orders/total',
    name: 'total-order',
    component: Orders
  },
  {
    path: '/order/:id',
    name: 'order',
    component: Orders
  },
  {
    path: '/customers',
    name: 'customers',
    component: Orders
  },
  {
    path: '/products',
    name: 'products',
    component: Orders
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Orders
  }
]

const router = new VueRouter({
  routes
})

export default router
