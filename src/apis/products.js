import { apiHelper } from './../utils/helpers'
// const getToken = () => localStorage.getItem('token')

export default {
  getProducts() {
    return apiHelper.get('/products')
  },
  getSizes() {
    return apiHelper.get('/admin/sizes')
  },
  createProduct({ payload }) {
    return apiHelper.post('/product', { payload })
  }
}
