import Vue from 'vue'
import VueRouter from 'vue-router'
import Orders from '../views/Orders.vue'
import Products from '../views/Products.vue'
import store from '../store'
import { Toast } from './../utils/helpers'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    exact: true,
    redirect: '/signin'
  },
  {
    path: '/signin',
    name: 'sign-in',
    component: () => import('../views/SignIn.vue')
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

router.beforeEach((to, from, next) => {
  try {
    const tokenInLocalStorage = localStorage.getItem('token')
    const tokenInStore = store.state.token
    let isAuthenticated = store.state.isAuthenticated

    const pathsWithoutAuthentication = ['sign-up']
    if (pathsWithoutAuthentication.includes(to.name)) {
      next()
      return
    }
    if (!isAuthenticated && to.name !== 'sign-in') {
      next('/signin')
      return
    }

    // 有 token 又想去signIn page 則轉址到餐聽首頁
    if (isAuthenticated && to.name === 'sign-in') {
      next('/orders')
      return
    }

    if (tokenInLocalStorage !== tokenInStore) {
      store.commit("revokeAuthentication")
    }

    next()
  } catch (err) {
    Toast.fire({
      icon: 'error',
      title: '切換頁面取得認證失敗'
    })
  }
})


export default router
