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
    let modelsWithWeek = rootState.data[rootGetters['switches/selectedRegion']]
        .seasons[rootGetters['switches/selectedSeason']]
        .models
    let timePointsWeek = rootGetters['timePoints'].map(tp => tp.week)

    function weekToIndex (week) {
      let wInt = Math.floor(week)
      if (wInt === 0) wInt = Math.max(...timePointsWeek)
      if (wInt === 53) wInt = 1
      return timePointsWeek.indexOf(wInt)
    }

    modelsWithWeek.forEach(m => {
      let oldPredictions = m.predictions.slice()
      m.predictions = timePointsWeek.map(week => {
        let indexOfWeek = oldPredictions.map(p => p.week % 100).indexOf(week)
        if (indexOfWeek > -1) {
          let { week, ...rest } = oldPredictions[indexOfWeek] // eslint-disable-line
          // Transform weeks to indices
          let weekTargets = ['peakWeek', 'onsetWeek']
          weekTargets.forEach(target => {
            rest[target].point = weekToIndex(rest[target].point)
            rest[target].high = rest[target].high.map(val => weekToIndex(val))
            rest[target].low = rest[target].low.map(val => weekToIndex(val))
          })

          return rest
        } else {
          return null
        }
      })
    })

    return modelsWithWeek
  },

  /**
   * Temporary getter to test distribution plots
   */
  modelRandomDistribution: (state, getters, rootState, rootGetters) => {
    let modelsWithWeek = rootState.data[rootGetters['switches/selectedRegion']]
        .seasons[rootGetters['switches/selectedSeason']]
        .models

    return modelsWithWeek.map(m => {
      m.predictions = {
        x: [...Array(10).keys()],
        y: [...Array(10).keys()].map(d => Math.random())
      }
      return m
    })
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
