import Vue from 'vue'
import VueRouter from 'vue-router'
import Orders from '../views/Orders.vue'
import Products from '../views/Products.vue'

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
    path: '/order/:id',
    name: 'order',
    component: () => import('../views/Order.vue')
  },
  {
    path: '/customers',
    name: 'customers',
    component: () => import('../views/Customers.vue')
  },
  {
    path: '/customer/:id',
    name: 'customer',
    component: () => import('../views/Customer.vue')
  },
  {
    path: '/products',
    name: 'products',
    component: Products
  },
  {
    path: '/product/create',
    name: 'product-create',
    component: () => import('../views/CreateProduct.vue')
  },
  {
    path: '/product/:id',
    name: 'product',
    component: () => import('../views/CreateProduct.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Orders

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
