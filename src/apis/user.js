import { apiHelper } from './../utils/helpers'
// const getToken = () => localStorage.getItem('token')
import qs from 'qs'

export default {
  signIn({ info }) {
    return apiHelper.post('/admin/signin', qs.stringify(info))
  },
  auth() {
    return apiHelper.post('/admin/auth', null)
  }
}