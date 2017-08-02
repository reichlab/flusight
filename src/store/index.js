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
import configYaml from 'json!yaml!../../config.yaml'

Vue.use(Vuex)

const state = {
  // D3 plot objects
  timeChart: null,
  choropleth: null,
  distributionChart: null,
  data: [], // Container for season data
  history: null,
  metadata: null,
  seasonDataUrls: null,
  branding: Object.assign({logo: ''}, configYaml.branding)
}

// mutations
const mutations = {
  [types.ADD_SEASON_DATA] (state, val) {
    state.data.push(val)
    // TODO: Remove data if short on memory
  },

  [types.SET_SEASON_DATA_URLS] (state, val) {
    state.seasonDataUrls = val
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
