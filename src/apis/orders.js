import { apiHelper } from './../utils/helpers'
// const getToken = () => localStorage.getItem('token')
import qs from 'qs'

export default {
  getOrders({ ordersDate }) {
    return apiHelper.post('/admin/orders/date', qs.stringify(ordersDate))
  },
  postOrder({ formData }) {
    return apiHelper.post('/admin/order', qs.stringify(formData))
  },
  getOrder({ orderId }) {
    return apiHelper.get(`/admin/order/${orderId}`)
  },
  updateOrder({ orderId, formData }) {
    return apiHelper.put(`/admin/order/${orderId}`, formData)
  }
}
