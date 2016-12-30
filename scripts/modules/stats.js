/**
 * Get model statistics
 */

const mmwr = require('mmwr-week')

/**
 * Wrapper around week delta for working with weekStamps
 */
const weekDeltaWrapper = (weekStamp, delta) => {
  let out = mmwr.MMWRWeekWithDelta(Math.floor(weekStamp / 100),
                                   weekStamp % 100, delta)
  return parseInt(out.year + '' + out.week)
}

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
 * Return logscore from given bin distribution and actual value
 */
const getLogScore = (bins, actual) => {
  //
}

/**
 * Return mean absolute error between point preds and actual data
 * Assumes `cachedPredictions` weeks are in actual
 */
const statsMae = (filteredPreds, actual) => {
  let keys = ['oneWk', 'twoWk', 'threeWk', 'fourWk']
  let diffs = {}

  keys.forEach(key => {
    diffs[key] = []
  })

  filteredPreds.forEach(p => {
    let actualIndex = actual.map(d => d.week).indexOf(p.week)

    keys.forEach((key, idx) => {
      let actualData = actual[actualIndex + 1 + idx].data
      if (actualData !== -1) diffs[key].push(Math.abs(actualData - p[key].point))
    })
  })

  // Take mean
  keys.forEach(key => {
    diffs[key] = diffs[key].reduce((a, b) => a + b) / diffs[key].length
  })

  return diffs
}

const statsLog = (filteredPreds, actual) => {
  return {
    oneWk: NaN,
    twoWk: NaN,
    threeWk: NaN,
    fourWk: NaN
  }
}

const getModelStats = (cachedPredictions, actual, regionId) => {
  let filteredPreds = filterCache(cachedPredictions, regionId)

  if (filteredPreds.length > 0) {
    return {
      mae: statsMae(filteredPreds, actual),
      log: statsLog(filteredPreds, actual)
    }
  } else {
    return null
  }
}

exports.getModelStats = getModelStats
