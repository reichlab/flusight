/**
 * Get model statistics
 */

/**
 * Filter cache by region to create a series of predictions
 */
const filterCache = (cachedPredictions, regionId) => {
  let output = []

  for (let weeklyCache in cachedPredictions) {
    if (cachedPredictions.hasOwnProperty(weeklyCache)) {
      let perWeekPreds = {
        week: parseInt(weeklyCache)
      }
      cachedPredictions[weeklyCache]
        .filter(cp => cp.region === regionId)
        .forEach(item => {
          perWeekPreds[item.target] = {
            point: item.point,
            low: item.low,
            high: item.high,
            bins: item.bins
          }
        })

      // Assuming all the predictions are not present when one isn't
      if (perWeekPreds.oneWk.point !== -1) {
        output.push(perWeekPreds)
      }
    }
  }
  return output
}

/**
 * Return MAE from given prediction and actual value
 */
const statFuncMAE = (pred, actual) => Math.abs(actual - pred.point)

/**
 * Return log score from given prediction and actual value
 */
const statFuncLog = (pred, actual) => {
  for (let i = 0; i < pred.bins.length; i++) {
    if (pred.bins[i][1] > actual) {
      return Math.log(pred.bins[i][2])
    }
  }
  return null
}

/**
 * Calculate stuff using given function
 */
const statsCore = (filteredPreds, actual, statFunc) => {
  // Keys to work on
  let keys = ['oneWk', 'twoWk', 'threeWk', 'fourWk']
  let scores = {}

  keys.forEach(key => {
    scores[key] = []
  })

  filteredPreds.forEach(p => {
    let actualIndex = actual.map(d => d.week).indexOf(p.week)

    keys.forEach((key, idx) => {
      let actualData = actual[actualIndex + 1 + idx].data
      if (actualData !== -1) scores[key].push(statFunc(p[key], actualData))
    })
  })

  // Take mean
  keys.forEach(key => {
    scores[key] = scores[key].reduce((a, b) => a + b) / scores[key].length
  })

  // Return a plain list
  return keys.map(key => scores[key])
}

const getModelStats = (cachedPredictions, actual, regionId) => {
  let filteredPreds = filterCache(cachedPredictions, regionId)

  if (filteredPreds.length > 0) {
    return {
      mae: statsCore(filteredPreds, actual, statFuncMAE),
      log: statsCore(filteredPreds, actual, statFuncLog)
    }
  } else {
    return null
  }
}

exports.getModelStats = getModelStats
