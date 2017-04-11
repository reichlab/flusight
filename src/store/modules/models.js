const state = {
  statsMeta: [{
    id: 'mae',
    name: 'Mean Absolute Error',
    header: ['1 wk', '2 wk', '3 wk', '4 wk'],
    url: 'https://en.wikipedia.org/wiki/Mean_absolute_error',
    bestFunc: Math.min
  }, {
    id: 'log',
    name: 'Mean Log Score',
    header: ['1 wk', '2 wk', '3 wk', '4 wk'],
    url: 'https://en.wikipedia.org/wiki/Scoring_rule#Logarithmic_scoring_rule',
    bestFunc: Math.max
  }],

  confidenceIntervals: ['90%', '50%'],

  targetNames: [
    '1 week ahead',
    '2 weeks ahead',
    '3 weeks ahead',
    '4 weeks ahead',
    'Peak week',
    'Peak percentage',
    'Onset week'
  ]
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

    // TODO fix this mutation
    // NOTE documenting this process for further work
    // Without anything, m.predictions is a list of elements like
    // {series: [], onsetTime, peakTime ..., week}
    //
    // What we get after processing is
    // an array with null for each week without prediction and others like
    // {series: [], onsetTime, peakTime ...}
    // Also we convert the week stamp (201630) to index for the timestamp series that
    // we are sending anyways
    //
    // What we need is to apply a mutation initially on the main state which does this
    // let it stay there or just cache this change somewhere.
    modelsWithWeek.forEach(m => {
      let oldPredictions = m.predictions.slice()
      m.predictions = timePointsWeek.map(week => {
        let indexOfWeek = oldPredictions.map(p => p.week % 100).indexOf(week)
        if (indexOfWeek > -1) {
          let { week, ...rest } = oldPredictions[indexOfWeek] // eslint-disable-line
          // Transform weeks to indices
          let timeTargets = ['peakTime', 'onsetTime']
          timeTargets.forEach(target => {
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
   * TODO Temporary getter to test distribution plots
   */
  modelDistributions: (state, getters, rootState, rootGetters) => {
    let models = getters.models
    return models.map(m => {
      m.targets = state.targetNames.map(tn => {
        return {
          name: tn,
          data: [...Array(10).keys()].map(x => [x, Math.random()]),
          actual: Math.floor(Math.random() * (10 - 0)) + 0
        }
      })
      return m
    })
  },

  modelIds: (state, getters) => getters.models.map(m => m.id),

  modelMeta: (state, getters) => getters.models.map(m => m.meta),

  modelStatsMeta: (state, getters) => state.statsMeta,

  modelCIs: (state, getters) => state.confidenceIntervals
}

export default {
  namespaced: true,
  state,
  getters
}
