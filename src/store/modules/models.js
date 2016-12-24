import * as d3 from 'd3'

const state = {
  colors: d3.schemeCategory10,
  selectedStat: 0,
  stats: [{
    id: 'mae',
    name: 'Mean Absolute Error',
    url: 'https://en.wikipedia.org/wiki/Mean_absolute_error'
  }, {
    id: 'log',
    name: 'Log Score',
    url: '#'
  }]
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

  selectedStat: state => state.selectedStat,

  modelStats: (state, getters) => {
    let stats = getters.models.map(m => m.stats)

    let statsMeta = state.stats[getters.selectedStat]

    let output = {}
    // Assume if one model has no stats, no one has
    if (stats[0]) {
      // Formatted stuff
      let keys = ['oneWk', 'twoWk', 'threeWk', 'fourWk']

      output.name = statsMeta.name
      output.url = statsMeta.url
      let data = stats.map(s => s[statsMeta.id])
      output.data = data.map(d => {
        let ob = {}
        keys.forEach(key => {
          ob[key] = {
            value: d[key].toFixed(2),
            best: false
          }
        })
        return ob
      })

      // Apply properties to lowest error item

      keys.forEach(key => {
        let perKey = data.map(d => d[key])
        let minIdx = perKey.indexOf(Math.min(...perKey))

        console.log(minIdx)
        output.data[minIdx][key].best = true
      })

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
