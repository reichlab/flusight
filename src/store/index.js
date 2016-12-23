// Main vuex store

import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import intro from './modules/intro'
import jsonData from '!json!../assets/data.json'
import * as types from './mutation-types'

Vue.use(Vuex)

const state = {
  // D3 plot objects
  timeChart: null,
  choropleth: null,

  // Simple indices of selections
  selected: {
    region: 0, // Handle region selector
    season: 0, // Handle season selector
    week: {
      idx: 0,
      name: null
    } // Week pointer
  },

  // All the data!
  data: jsonData.data,

  // All the metadata!
  metadata: jsonData.metadata,

  // Toggles
  toggles: {
    panels: {
      legend: true,
      stats: false
    },
    choroplethRelative: false
  }
}

// mutations
const mutations = {
  [types.UPDATE_SELECTED_REGION] (state, val) {
    state.selected.region = val
  },

  [types.UPDATE_SELECTED_SEASON] (state, val) {
    state.selected.season = val
  },

  [types.UPDATE_SELECTED_WEEK] (state, val) {
    state.selected.week.idx = val.idx
    state.selected.week.name = val.name
  },

  [types.SET_TIMECHART] (state, val) {
    state.timeChart = val
  },

  [types.SET_CHOROPLETH] (state, val) {
    state.choropleth = val
  },

  [types.TOGGLE_PANEL] (state, val) {
    // Hide everything else
    for (let panel in state.toggles.panels) {
      if (panel === val) state.toggles.panels[panel] = !state.toggles.panels[panel]
      else state.toggles.panels[panel] = false
    }
  },

  [types.TOGGLE_CHOROPLETH_RELATIVE] (state) {
    state.toggles.choroplethRelative = !state.toggles.choroplethRelative
  }
}

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {
    intro
  }
})
