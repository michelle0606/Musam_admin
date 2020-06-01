import { apiHelper } from '../utils/helpers'
// const getToken = () => localStorage.getItem('token')

export default {
  getCustomers() {
    return apiHelper.get('/admin/customers')
  },
  getCustomer({ customerId }) {
    return apiHelper.get(`/admin/customer/${customerId}`)
  }
}
