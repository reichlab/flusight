import Vue from 'vue'

import App from './App'
import store from './store'

import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.css'
import './assets/fakeLoader.css'
import './assets/favicon.ico'

new Vue({
  el: 'body',
  store,
  components: { App }
})
