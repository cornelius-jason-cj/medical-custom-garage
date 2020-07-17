import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import auth from './modules/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  modules:{
    auth
  },
  // keeping our data we are sharing with our components
  state: {
    invoiceList: [],
    profitList: [],
    belanjaList: [],
    totalBelanja: null
  },
  // computed properties. simple functions to get a state
  getters: {
  },
  //like methods, should not mutate the state
  //very good spot to fetch a data. action call usualy should resolve into data
  actions: {
    fetchInvoiceList ({state, commit}) {
      axios.get('/api/invoice')
      .then(res => {
        const invoiceList = res.data
        commit('setInvoiceList', invoiceList)
        return state.invoiceList
      })
    },
    fetchProfitList ({state, commit}) {
      axios.get('/api/profit')
      .then(res => {
        const profitList = res.data
        commit('setProfitList', profitList)
        return state.profitList
      })
    },
    fetchBelanjaList ({state, commit}) {
      axios.get('/api/belanja')
      .then(res => {
        const belanjaList = res.data
        commit('setBelanjaList', belanjaList)
        return state.belanjaList, state.totalBelanja
      })
    }
  },
  //simple functions to mutate a state
  mutations: {
    setInvoiceList (state, invoiceList) {
      state.invoiceList = invoiceList
    },
    setProfitList (state, profitList) {
      state.profitList = profitList
    },
    setBelanjaList (state, belanjaList) {
      let arrayHarga = []
      belanjaList.forEach(data => {
        arrayHarga.push(parseInt(data.purchasePrice))
      })
      const reducer = (accumulator, currentValue) => accumulator + currentValue
      let totalHarga = arrayHarga.reduce(reducer)
      totalHarga = totalHarga.toString()
      state.belanjaList = belanjaList
      state.totalBelanja = totalHarga
    }
  }
})