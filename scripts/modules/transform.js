/**
 * Module for format transformation from csv to json
 */

const Papa = require('papaparse')
const d3 = require('d3')

/**
 * Return confidence ranges and point prediction for given series
 * @param {Array} series an array of (unit type, bin start, bin end, value)
 * @returns {Object} object with keys 'low', 'high' and 'point'
 */
const parseSeries = series => {
  if (series.length === 1) return null

  // Partition series into point and bin predictions
  let pointRows = series.filter(row => row[0] === 'Point')
  let binRows = series.filter(row => row[0] === 'Bin')

  // Skip 'none' bin for season onset
  binRows = binRows.filter(row => row[1] !== 'none')

  let len = binRows.length

  // Both end trimming values for confidence intervals
  let confidenceTrims = [0.05, 0.25]

  let accumulator = {
    low: 0,
    high: 0
  }
  let range = {
    low: [null, null],
    high: [null, null]
  }
  let maxIdx = 0
  let maxValue = binRows[maxIdx][3]

  // Checking if everything is same
  let matches = 0

  for (let i = 0; i < len; i++) {
    // Look for max
    if (binRows[i][3] > maxValue) {
      maxIdx = i
      maxValue = binRows[maxIdx][3]
    }

    // Skip last value which can be (slightly, weirdly) different
    if ((i < (len - 1)) && (binRows[0][3] === binRows[i][3])) {
      matches += 1
    }

    // Update accumulators
    accumulator.low += binRows[i][3]
    accumulator.high += binRows[len - i - 1][3]

    if ((accumulator.low > confidenceTrims[0]) && (!range.low[0])) {
      range.low[0] = binRows[i][1]
    }
    if ((accumulator.high > confidenceTrims[0]) && (!range.high[0])) {
      range.high[0] = binRows[len - i - 1][2]
    }

    if ((accumulator.low > confidenceTrims[1]) && (!range.low[1])) {
      range.low[1] = binRows[i][1]
    }
    if ((accumulator.high > confidenceTrims[1]) && (!range.high[1])) {
      range.high[1] = binRows[len - i - 1][2]
    }
  }

  if (matches === (len - 1)) {
    // No actual prediction, skip these
    return {
      low: [-1, -1],
      high: [-1, -1],
      point: -1,
      bins: null
    }
  } else {
    // Overwrite point prediction if it was explicitly specified
    let point = pointRows.length !== 0 ? pointRows[0][3] : binRows[maxIdx][1]

    return {
      low: range.low,
      high: range.high,
      point: point,
      bins: binRows.map(row => [row[1], row[2], row[3]])
    }
  }
}

/**
 * Return json representation of long format csv data.
 * @param {string} csvData long format csv content
 * @returns {Object} json pbject
 */
const csvToJson = csvData => {
  let data = Papa.parse(csvData, {
    dynamicTyping: true
  })

  data = data.data.slice(1)

  let grouped = d3.nest()
      .key(d => d[0]) // Group by location
      .key(d => d[1]) // target
      .rollup(rows => parseSeries(rows.map(l => [l[2], l[4], l[5], l[6]])))
      .entries(data)

  // Format data according to pipeline requirements
  // Unroll two key levels
  let output = []

  // Map keys from csv to json
  let keyMap = {
    'Season onset': 'onsetTime',
    'Season peak week': 'peakTime',
    'Season peak percentage': 'peakValue',
    '1 wk ahead': 'oneWk',
    '2 wk ahead': 'twoWk',
    '3 wk ahead': 'threeWk',
    '4 wk ahead': 'fourWk'
  }

  grouped.forEach(regionGroup => {
    regionGroup.values.forEach(targetGroup => {
      if (targetGroup.value) {
        output.push({
          region: regionGroup.key,
          target: keyMap[targetGroup.key],
          point: targetGroup.value.point,
          low: targetGroup.value.low,
          high: targetGroup.value.high,
          bins: targetGroup.value.bins
        })
      }
    })
  })

  return output
}

exports.csvToJson = csvToJson
