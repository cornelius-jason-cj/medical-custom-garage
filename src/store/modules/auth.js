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
      return axios.post('http://localhost:5000/api/user/login', userData)
      .then(res => {
        console.log("hasil hit api login", res)
        let user = res.data
        user.isAuthenticated = true
        commit('setAuthUser', user)
        return user
      })
      .then(res => {
        console.log('masuk ke get user me', res)
        return axios.post('http://localhost:5000/api/user/me', res)
        .then((res) => {
          console.log('hasil hit api get me')
          const user = res.data
          commit('setAuthUser', user)
          return user
        })
      })
    },
    // getAuthUser ({commit}) {
    //   console.log('masuk ke get auth user')
      // return axios.get('http://localhost:5000/api/user/me')
      //   .then((res) => {
      //   console.log("getAuthUser -> res", res)
      //     const user = res.data
      //     commit('setAuthUser', user)
      //     commit('setAuthState', true)
      //     return user
      //   })
      //   .catch(err => {
      //   console.log("getAuthUser -> err", err)
      //     commit('setAuthUser', null)
      //     commit('setAuthState', true)
      //     return err
      //   })
    // },
    logout ({commit}) {
      return axios.post('http://localhost:5000/api/user/logout')
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