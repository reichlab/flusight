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

  curveNames: [
    '1 week ahead',
    '2 weeks ahead',
    '3 weeks ahead',
    '4 weeks ahead',
    'Peak week',
    'Peak percentage',
    'Onset week'
  ],

  // Cache for unpacked curve data
  // Identifies curves using `seasonIdx-regionIdx-weekIdx-modelIdx-curveIdx`
  curveCache: {}
}

/**
 * Regenerate array in the compressed representation
 * Assume its a probability distribution and so it sums to one
 */
// const deCompressArray = compArray => {
//   let array = Array(Math.max(...compArray.map(i => i[0]))).fill(0)

//   let clamped = []
//   // Fill in given values
//   compArray.forEach(item => {
//     array[item[0]] = item[1]
//     clamped.push(item[0])
//   })

//   let epsilon = 1e-8 // Try to acheive 1e-8 error
//   let alpha = 1
//   let maxIter = 100
//   let sum, error

//   for (let i = 0; i < maxIter; i++) {
//     sum = array.reduce((a, b) => (a + b), 0)
//     error = 1 - sum
//     if (Math.abs(error) < epsilon) {
//       break
//     } else {
//       // Neighbour filling
//       for (let j = 1; j < array.length - 1; j++) {
//         if (clamped.indexOf(j) === -1) {
//           array[j] += alpha * error * (array[j - 1] + array[j + 1]) / 2
//         }
//       }
//     }
//   }

//   return array
// }

// getters
const getters = {
  models: (state, getters, rootState, rootGetters) => {
    return rootState.data[rootGetters['switches/selectedRegion']]
      .seasons[rootGetters['switches/selectedSeason']]
      .models
  },

  /**
   * Getter for generating probability distributions
   */
  modelDistributions: (state, getters, rootState, rootGetters) => {
    let models = getters.models
    let currentWeekIdx = rootGetters['weeks/selectedWeekIdx']
    let timePoints = rootGetters['weeks/weeks']

    let curveIdentifierPrefix = rootGetters['switches/selectedSeason'] + '-' + rootGetters['switches/selectedRegion'] + '-' + currentWeekIdx

    return models.map((m, idx) => {
      let currentPreds = m.predictions[currentWeekIdx]
      m.curves = state.curveNames.map(cn => {
        return {
          name: cn,
          data: null,
          actual: null
        }
      })
      if (currentPreds) {
        // Predictions are present
        // Decompress the bins and latch on to curves
        let curves = [
          ...currentPreds.series.map(s => s.bins),
          currentPreds.peakTime.bins,
          currentPreds.peakValue.bins,
          currentPreds.onsetTime.bins
        ]

        for (let i = 0; i < m.curves.length; i++) {
          let paddedArray

          let curveIdentifier = curveIdentifierPrefix + '-' + idx + '-' + i
          if (state.curveCache[curveIdentifier]) {
            paddedArray = state.curveCache[curveIdentifier]
          } else {
            // let unpackedArray = deCompressArray(curves[i])
            // let totalBins = unpackedArray.length
            // if (totalBins === 33) {
            //   // Pad unpackedArray
            //   let startAt = 9
            //   paddedArray = timePoints.map((tp, idx) => {
            //     if ((idx > startAt) && (idx < (startAt + unpackedArray.length))) {
            //       return [tp, unpackedArray[idx - startAt]]
            //     } else {
            //       return [tp, 0]
            //     }
            //   })
            // } else {
            //   // These are value bins, divide by 10
            //   paddedArray = unpackedArray.map((val, key) => [(key / 10), val])
            // }
            // state.curveCache[curveIdentifier] = paddedArray

            if (curves[i].length === 33) {
              // These are week values
              let startAt = 9
              paddedArray = timePoints.map((tp, idx) => {
                if ((idx > startAt) && (idx < (startAt + curves[i].length))) {
                  return [tp, curves[i][idx - startAt]]
                } else {
                  return [tp, 0]
                }
              })
            } else {
              // These are value bins
              if (curves[i].length === 26) {
                // New bins
                paddedArray = curves[i].map((val, idx) => [0.5 * idx, val])
              } else {
                // Old bins
                paddedArray = curves[i].map((val, idx) => [idx, val])
              }
            }

            state.curveCache[curveIdentifier] = paddedArray
          }

          m.curves[i].data = paddedArray
          m.curves[i].actual = 0
        }
      }
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
