import { apiHelper } from './../utils/helpers'
// const getToken = () => localStorage.getItem('token')

export default {
  getOrders() {
    return apiHelper.get('/admin/orders')
  },
  postOrder() {
    return apiHelper.post('/admin/order')
  },
  getOrder() {
    return apiHelper.get('/admin/order/:order_id')
  },
  updateOrder() {
    return apiHelper.put('/admin/order/:order_id')
  }
}
