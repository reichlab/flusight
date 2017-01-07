import Vue from 'vue'
import VueHead from 'vue-head'

import App from './App'
import store from './store'

import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.css'
import './assets/fakeLoader.css'
import './assets/favicon.ico'
import './assets/analytics.js'

Vue.use(VueHead)

Vue.create = options => new Vue(options)

Vue.create({
  el: 'body',
  store,
  components: { App }
})
