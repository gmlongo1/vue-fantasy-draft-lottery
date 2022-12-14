/* import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './store'
import router from './router'

Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
*/
import Vue from 'vue'

//import Vuetify from 'vuetify'
import vuetify from './plugins/vuetify'
import 'vuetify/dist/vuetify.css'

import App from './App'
import * as firebase from 'firebase'
import router from './router'
import { store } from './store'
import './registerServiceWorker'

Vue.config.productionTip = false

firebase.initializeApp({
  apiKey: 'AIzaSyA98NHqb101v85tM5elcj375h2gah7ssDE',
  authDomain: 'fantasy-lottery.firebaseapp.com',
  databaseURL: 'https://fantasy-lottery.firebaseio.com',
  projectId: 'fantasy-lottery',
  storageBucket: 'fantasy-lottery.appspot.com',
  messagingSenderId: '140254757076'
})

/* eslint-disable no-new */
/*new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () { }
})*/
new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
