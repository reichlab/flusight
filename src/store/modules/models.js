import * as d3 from 'd3'

const state = {
  colors: d3.schemeCategory10
}

// getters
const getters = {
  models: (state, getters, rootState, rootGetters) => {
    return rootState.data[rootGetters['switches/selectedRegion']]
      .seasons[rootGetters['switches/selectedSeason']]
      .models
  },

  modelIds: (state, getters) => getters.models.map(m => m.id),

  modelColors: (state, getters) => {
    return state.colors.filter((color, idx) => idx < getters.models.length)
  },

  modelMeta: (state, getters) => getters.models.map(m => m.meta),

  modelStats: (state, getters) => {
    let stats = getters.models.map(m => m.stats)

    let output = {}
    // Assume if one model has no stats, no one has
    if (stats[0]) {
      // Formatted stuff
      output.name = 'Mean Absolute Error'
      output.url = 'https://en.wikipedia.org/wiki/Mean_absolute_error'
      output.upto = stats[0].upto
      output.data = stats.map(s => s.mae)
      return output
    } else {
      return null
    }
  }
}
// actions
const actions = {
}

// mutations
const mutations = {
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
