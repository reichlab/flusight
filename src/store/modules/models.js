const state = {
  stats: [{
    id: 'mae',
    name: 'Mean Absolute Error',
    url: 'https://en.wikipedia.org/wiki/Mean_absolute_error',
    bestFunc: Math.min
  }, {
    id: 'log',
    name: 'Mean Log Score',
    url: 'https://en.wikipedia.org/wiki/Scoring_rule#Logarithmic_scoring_rule',
    bestFunc: Math.max
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

  modelMeta: (state, getters) => getters.models.map(m => m.meta),

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
            value: d[key] ? d[key].toFixed(2) : 'NA',
            best: false
          }
        })
        return ob
      })

      // Apply properties to best item
      // Don't go for it when value is null
      if (data[0]['oneWk']) {
        keys.forEach(key => {
          let perKey = data.map(d => d[key])
          let bestIdx = perKey.indexOf(statsMeta.bestFunc(...perKey))

          output.data[bestIdx][key].best = true
        })
      }

      return output
    } else {
      return null
    }
  }
}

export default {
  namespaced: true,
  state,
  getters
}
