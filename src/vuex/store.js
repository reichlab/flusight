import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const state = {
  name: ""
}

const mutations = {
  TEST (state, val) {
    state.name = val
  }
}

export default new Vuex.Store({
  state,
  mutations
})
