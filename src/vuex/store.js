import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const state = {
  // D3 stuff
  chart: null,
  map: null,

  selected: {
    region: 0,
    season: 0,
    model: 0
  },

  // All the data!
  data: [],
  // All the metadata!
  metadata: {}
}

const mutations = {
  UPDATE_MODEL (state, val) {
    state.selected.model = val
  },

  UPDATE_REGION (state, val) {
    state.selected.region = val
  },

  UPDATE_SEASON (state, val) {
    state.selected.season = val
  },

  SET_CHART (state, val) {
    state.chart = val
  },

  SET_MAP (state, val) {
    state.map = val
  },

  INITIALIZE_DATA (state, val) {
    state.data = val.data
    state.metadata = val.metadata
  }
}

export default new Vuex.Store({
  state,
  mutations
})
