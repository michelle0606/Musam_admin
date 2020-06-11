import { apiHelper } from '../utils/helpers'

export default {
  getProfit() {
    return apiHelper.get('/admin/dashboard')
  },
}
