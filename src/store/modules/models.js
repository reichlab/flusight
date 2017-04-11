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
    return rootState.data[rootGetters['switches/selectedRegion']]
      .seasons[rootGetters['switches/selectedSeason']]
      .models
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
