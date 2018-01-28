// Getter only scores module

const state = {
  targets: [
    '1-ahead',
    '2-ahead',
    '3-ahead',
    '4-ahead',
    'onset-wk',
    'peak',
    'peak-wk'
  ],
  headersMap: {
    '1-ahead': '1 wk ahead',
    '2-ahead': '2 wk ahead',
    '3-ahead': '3 wk ahead',
    '4-ahead': '4 wk ahead',
    'onset-wk': 'Onset week',
    'peak': 'Peak %',
    'peak-wk': 'Peak week'
  },
  meta: [{
    id: 'absError',
    name: 'Mean Absolute Error',
    url: 'https://en.wikipedia.org/wiki/Mean_absolute_error',
    bestFunc: items => Math.min(...items.filter(d => d !== null))
  }, {
    id: 'logScore',
    name: 'Mean Log Score (single bin)',
    url: 'https://en.wikipedia.org/wiki/Scoring_rule#Logarithmic_scoring_rule',
    bestFunc: items => Math.max(...items.filter(d => d !== null))
  }, {
    id: 'logScoreMultiBin',
    name: 'Mean Log Score (multi bin)',
    url: 'https://en.wikipedia.org/wiki/Scoring_rule#Logarithmic_scoring_rule',
    bestFunc: items => Math.max(...items.filter(d => d !== null))
  }]
}

// getters
const getters = {
  scoresMeta: state => state.meta,
  scoresHeadersMap: state => state.headersMap,
  scoresHeaders: state => state.targets.map(t => state.headersMap[t]),
  scoresTargets: state => state.targets
}

export default {
  namespaced: true,
  state,
  getters
}
