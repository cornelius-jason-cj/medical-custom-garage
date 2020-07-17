import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import vuelidate from 'vuelidate'
import axios from 'axios'

console.log(process.env.VUE_APP_URI)
console.log(process.env.production.VUE_APP_URI)
axios.defaults.baseURL = 'http://localhost:5000'

Vue.config.productionTip = false

Vue.use(vuelidate)

new Vue({
  vuetify,
  router,
  store,
  vuelidate,
  render: h => h(App)
}).$mount('#app')
