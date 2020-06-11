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
  getOrder(orderId) {
    return apiHelper.get(`/admin/order/${orderId}`)
  },
  cancelOrder({ id, formData }) {
    return apiHelper.put(`/admin/order/${id}/cancel`, qs.stringify(formData))
  },
  updateOrder({ formData }) {
    return apiHelper.put(`/admin/order/${formData.id}`, qs.stringify(formData))
  },
}
