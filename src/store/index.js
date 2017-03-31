// Main vuex store

import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import intro from './modules/intro'
import weeks from './modules/weeks'
import switches from './modules/switches'
import models from './modules/models'
import jsonData from '!json!../assets/data.json'
import * as types from './mutation-types'

Vue.use(Vuex)

const state = {
  // D3 plot objects
  timeChart: null,
  choropleth: null,
  distributionChart: null,

  // All the data!
  data: jsonData.data,

  branding: jsonData.branding
}

// mutations
const mutations = {
  [types.SET_TIMECHART] (state, val) {
    state.timeChart = val
  },

  [types.SET_CHOROPLETH] (state, val) {
    state.choropleth = val
  },

  [types.SET_DISTRIBUTIONCHART] (state, val) {
    state.distributionChart = val
  }
}

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {
    intro,
    weeks,
    switches,
    models
  }
})
