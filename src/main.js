import Vue from 'vue'

import App from './App'
import store from './store'

import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.css'
import './assets/fakeLoader.css'
import './assets/favicon.ico'

Vue.create = options => new Vue(options)

Vue.create({
  el: 'body',
  store,
  components: { App }
})
