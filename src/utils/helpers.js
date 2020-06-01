import axios from 'axios'
import Swal from 'sweetalert2'

const baseURL = process.env.VUE_APP_BACKENDURL || 'http://localhost:3000'

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true

})

axiosInstance.interceptors.request.use(
  config => {
    // 從 localStorage 將 token 取出
    const token = localStorage.getItem('token')

    // 如果 token 存在的話，則帶入到 headers 當中，藉此到後端使用JWT解析
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  err => Promise.reject(err)
)

export const apiHelper = axiosInstance

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
})
