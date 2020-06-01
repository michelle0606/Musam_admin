import { apiHelper } from './../utils/helpers'
// const getToken = () => localStorage.getItem('token')

export default {
  getProducts() {
    return apiHelper.get('/admin/products')
  },
  getSizes() {
    return apiHelper.get('/admin/sizes')
  },
  createProduct(payload) {
    return apiHelper.post('/admin/product', payload)
  },
  getProduct({ productId }) {
    return apiHelper.get(`/product/${productId}`)
  },
  putProduct({ productId, formData }) {
    return apiHelper.put(`/admin/product/${productId}`, formData)
  },
  changeProductStatus({ productId }) {
    return apiHelper.post(`/admin/product/status/${productId}`)
  }
}
