import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketio from 'vue-socket.io'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(new VueSocketio({
  debug: true,
  connection: 'http://localhost:8081'
}))//这里的url是后台提供的socket的地址


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
