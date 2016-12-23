import * as types from '../mutation-types'

const state = {
  region: 0,
  season: 0,

  panels: {
    legend: true,
    stats: false
  },

  choroplethRelative: false
}

// getters
const getters = {
  selectedSeason: state => state.season,
  selectedRegion: state => state.region,
  choroplethRelative: state => state.choroplethRelative,
  legendShow: state => state.panels.legend,
  statsShow: state => state.panels.stats
}
// actions
const actions = {
  updateSelectedSeason ({ commit }, val) {
    commit(types.UPDATE_SELECTED_SEASON, val)
  },

  updateSelectedRegion ({ commit, getters }, val) {
    // Trigger deselection
    if (getters.selectedRegion === val) commit(types.UPDATE_SELECTED_REGION, 0)
    else commit(types.UPDATE_SELECTED_REGION, val)
  },

  toggleLegend ({ commit }) {
    commit(types.TOGGLE_PANEL, 'legend')
  },

  toggleStats ({ commit }) {
    commit(types.TOGGLE_PANEL, 'stats')
  },

  toggleRelative ({ commit }) {
    commit(types.TOGGLE_CHOROPLETH_RELATIVE)
  }
}

// mutations
const mutations = {
  [types.UPDATE_SELECTED_REGION] (state, val) {
    state.region = val
  },

  [types.UPDATE_SELECTED_SEASON] (state, val) {
    state.season = val
  },

  [types.TOGGLE_PANEL] (state, val) {
    // Hide everything else
    for (let panel in state.panels) {
      if (panel === val) state.panels[panel] = !state.panels[panel]
      else state.panels[panel] = false
    }
  },

  [types.TOGGLE_CHOROPLETH_RELATIVE] (state) {
    state.choroplethRelative = !state.choroplethRelative
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
