import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import vuelidate from 'vuelidate'
import axios from 'axios'

axios.defaults.baseURL = process.env.VUE_APP_URI

Vue.config.productionTip = false

Vue.use(vuelidate)

new Vue({
  vuetify,
  router,
  store,
  vuelidate,
  render: h => h(App)
}).$mount('#app')
