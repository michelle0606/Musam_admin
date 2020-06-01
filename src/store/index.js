import Vue from 'vue'
import Vuex from 'vuex'
import UserAPI from '../apis/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: {
      id: -1,
      name: '',
      email: '',
    },
    isAuthenticated: false,
    token: ''
  },
  mutations: {
    setCurrentUser(state, currentUser) {
      console.log('current', currentUser)
      state.currentUser = {
        ...state.currentUser,
        // 將 API 取得的 currentUser 覆蓋掉 Vuex state 中的 currentUser
        ...currentUser
      }
      state.token = localStorage.getItem('token')
      // 將使用者的登入狀態改為 true
      state.isAuthenticated = true
    },
    revokeAuthentication(state) {
      state.currentUser = {
        id: -1,
        name: '',
        email: '',
      }
      state.isAuthenticated = false
      state.token = ''
      localStorage.removeItem('token')
    }
  },
  actions: {
    async fetchCurrentUser({ commit }) {
      try {
        // 呼叫 usersAPI.getCurrentUser() 方法，並將 response 顯示出來
        const { data, statusText } = await UserAPI.getCurrentUser()
        if (statusText !== 'OK') {
          throw new Error(statusText)
        }

        console.log('getCurrentUser', data)

        commit('setCurrentUser', {
          id: data.id,
          name: data.name,
          email: data.email,
        })

      } catch (error) {
        console.log('error', error)
        console.error('can not fetch user information')
      }
    }
  },
  modules: {
  }
})
