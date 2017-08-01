// Main vuex store

import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import intro from './modules/intro'
import weeks from './modules/weeks'
import switches from './modules/switches'
import models from './modules/models'
import * as types from './mutation-types'
import branding from 'json!yaml!../../config.yaml'

Vue.use(Vuex)

const state = {
  // D3 plot objects
  timeChart: null,
  choropleth: null,
  distributionChart: null,
  // All the data!
  data: null,
  history: null,
  metadata: null,
  branding: Object.assign({logo: ''}, branding.branding)
}

// mutations
const mutations = {
  [types.SET_DATA] (state, val) {
    state.data = val
  },

  [types.SET_HISTORY] (state, val) {
    state.history = val
  },

  [types.SET_METADATA] (state, val) {
    state.metadata = val
  },

  [types.SET_TIMECHART] (state, val) {
    state.timeChart = val
  },

  [types.SET_CHOROPLETH] (state, val) {
    state.choropleth = val
  },

  [types.SET_DISTRIBUTIONCHART] (state, val) {
    state.distributionChart = val
  },

  [types.SET_BRAND_LOGO] (state, val) {
    state.branding.logo = val
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
