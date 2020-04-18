import { apiHelper } from './../utils/helpers'
// const getToken = () => localStorage.getItem('token')

export default {
  getProducts() {
    return apiHelper.get('/products')
  },
  createProduct({ payload }) {
    return apiHelper.post('/product', { payload })
  }
}
