import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    exact: true,
    redirect: '/orders'
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('../views/Orders.vue')
  },
  {
    path: '/order/create',
    name: 'create-order',
    component: () => import('../views/CreateOrder.vue')
  },
  {
    path: '/orders/total',
    name: 'total-order',
    component: () => import('../views/TotalOrder.vue')
  },
  {
    path: '/order/:id',
    name: 'order',
    component: () => import('../views/Order.vue')
  },
  // {
  //   path: '/customers',
  //   name: 'customers',
  //   component: () => import('../views/Customers.vue')
  // },
  {
    path: '/products',
    name: 'products',
    component: () => import('../views/Products.vue')
  }
  // {
  //   path: '/dashboard',
  //   name: 'dashboard',
  //   component: () => import('../views/Dashboard.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
