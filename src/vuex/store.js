import Vue from 'vue'
import Vuex from 'vuex'

import jsonData from '!json!../assets/data.json'

Vue.use(Vuex)

const state = {
  // D3 stuff
  chart: null,
  map: null,

  // Index of dropdown selection
  selected: {
    region: 0,
    season: 0,
    model: 0
  },

  // All the data!
  data: jsonData.data,
  // All the metadata!
  metadata: jsonData.metadata,

  // Current epidemic week pointer
  weekPointer: null
}

const mutations = {
  UPDATE_SELECTED_MODEL (state, val) {
    state.selected.model = val
  },

  UPDATE_SELECTED_REGION (state, val) {
    state.selected.region = val
  },

  UPDATE_SELECTED_SEASON (state, val) {
    state.selected.season = val
  },

  SET_CHART (state, val) {
    state.chart = val
  },

  SET_MAP (state, val) {
    state.map = val
  }
}

export default new Vuex.Store({
  state,
  mutations
})
