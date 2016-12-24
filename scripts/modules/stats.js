/**
 * Get model statistics
 */

/**
 * Return mean absolute error between preds and actual data
 * Assumes `preds` weeks are in actual
 */
const statsMae = (preds, actual) => {
  let keys = ['oneWk', 'twoWk', 'threeWk', 'fourWk']
  let diffs = {}

  keys.forEach(key => {
    diffs[key] = []
  })

  preds.forEach(p => {
    let actualIndex = actual.map(d => d.week).indexOf(p.week)

    keys.forEach((key, idx) => {
      let actualData = actual[actualIndex + 1 + idx].data
      if (actualData !== -1) diffs[key].push(Math.abs(actualData - p[key].point))
    })
  })

  keys.forEach(key => {
    diffs[key] = diffs[key].reduce((a, b) => a + b) / diffs[key].length
  })

  return diffs
}

const getModelStats = (modelPreds, actual) => {
  if (modelPreds.length > 0) {
    return {
      upto: modelPreds[modelPreds.length - 1].week,
      mae: statsMae(modelPreds, actual)
    }
  } else {
    return null
  }
}

exports.getModelStats = getModelStats
