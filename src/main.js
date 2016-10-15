import Vue from 'vue'
import D3 from 'vue-d3'

import App from './App'

import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.css'
import 'hint.css/hint.css'
import './assets/fakeLoader.css'


Vue.use(D3)

new Vue({
  el: 'body',
  components: { App }
})
