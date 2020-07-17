import axios from 'axios'

export default {
  namespaced: true,
  state: {
    user: {},
    isAuthResolved: false
  },
  getters: {
    authUser (state) {
      return state.user || null
    },
  },
  actions: {
    loginWithEmailAndPassword ({commit}, userData) {
      return axios.post('/api/user/login', userData)
      .then(res => {
        let user = res.data
        user.isAuthenticated = true
        commit('setAuthUser', user)
        return user
      })
      .then(res => {
        return axios.post('/api/user/me', res)
        .then((res) => {
          const user = res.data
          commit('setAuthUser', user)
          return user
        })
      })
    },
    logout ({commit}) {
      return axios.post('/api/user/logout')
      .then(() => {
        commit('setAuthUser', null)
        return true
      })
      .catch(err => {
        console.log(err)
      })
    }
  },
  mutations: {
    setAuthUser (state, user) {
      return state.user = user
    },
    setAuthState (state, authState) {
      return  state.isAuthResolved = authState
    }
  }
}