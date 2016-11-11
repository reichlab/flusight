// Module for format transformation

const Papa = require('papaparse')

/**
 * Convert wide format content to long.
 * @param {string} wideFormat wide format csv content
 * @returns {string} long format csv content
 */
const wideToLong = (wideFormat) => {
  let data = Papa.parse(wideFormat, {
    dynamicTyping: true
  })

  if (data.errors.length > 0) {
    console.log('Error in reading datafile')
    process.exit(1)
  } else {
    data = data.data
  }

  // Skip 7 rows
  data.splice(0, 7)

  // Set up headers
  let headers = [
    'Location',
    'Target',
    'Type',
    'Unit',
    'Bin_start_incl',
    'Bin_end_notincl',
    'Value'
  ]

  // All locations
  let locations = data[0].filter(item => item != '')

  // Setup bins
  let onsetBinsStart = [...Array(13).keys()]
      .map(x => x + 40)
      .concat([...Array(20).keys()].map(x => ++x))

  let onsetBinsEnd = onsetBinsStart.map(x => ++x)
  let peakWeekBinsStart = onsetBinsStart.slice()
  let peakWeekBinsEnd = onsetBinsEnd.slice()

  // For no onset
  onsetBinsStart = onsetBinsStart.concat('none')
  onsetBinsEnd = onsetBinsEnd.concat('none')

  // These bins are cruder than those in new style submissions
  let valBinsStart = [...Array(27).keys()].map(x => x / 2)
  let valBinsEnd = valBinsStart.map(x => x + 0.5)
  valBinsEnd.pop()
  valBinsEnd.push('NA')

  // Setup metric metadata
  const metrics = [
    {
      name: 'Season onset',
      offset: [2, 0],
      unit: 'week',
      bins: {
        start: onsetBinsStart,
        end: onsetBinsEnd
      },
      point: [2 + onsetBinsStart.length, 0]
    },
    {
      name: 'Season peak week',
      offset: [2, 1],
      unit: 'week',
      bins: {
        start: peakWeekBinsStart,
        end: peakWeekBinsEnd
      },
      point: [3 + peakWeekBinsStart.length, 1]
    },
    {
      name: 'Season peak percentage',
      offset: [39, 4],
      unit: 'percent',
      bins: {
        start: valBinsStart,
        end: valBinsEnd
      },
      point: [39 + valBinsStart.length, 4]
    },
    {
      name: '1 wk ahead',
      offset: [39, 0],
      unit: 'percent',
      bins: {
        start: valBinsStart,
        end: valBinsEnd
      },
      point: [39 + valBinsStart.length, 0]
    },
    {
      name: '2 wk ahead',
      offset: [39, 1],
      unit: 'percent',
      bins: {
        start: valBinsStart,
        end: valBinsEnd
      },
      point: [39 + valBinsStart.length, 1]
    },
    {
      name: '3 wk ahead',
      offset: [39, 2],
      unit: 'percent',
      bins: {
        start: valBinsStart,
        end: valBinsEnd
      },
      point: [39 + valBinsStart.length, 2]
    },
    {
      name: '4 wk ahead',
      offset: [39, 3],
      unit: 'percent',
      bins: {
        start: valBinsStart,
        end: valBinsEnd
      },
      point: [39 + valBinsStart.length, 3]
    }
  ]

  // Global offsets in csv
  let locationOffsets = locations.map((val, ind) => {
    return 2 + ind * 6
  })

  // Create data list
  let output = []
  output.push(headers)

  for (let i = 0; i < locations.length; i++) {

    for (let j = 0; j < metrics.length; j++) {
      // Add point prediction
      output.push([
        locations[i],
        metrics[j].name,
        'Point',
        metrics[j].unit,
        'NA',
        'NA',
        data[metrics[j].point[0]][locationOffsets[i] + metrics[j].point[1]]
      ])
      // Add bins distributions

      for (let k = 0; k < metrics[j].bins.start.length; k++) {
        output.push([
          locations[i],
          metrics[j].name,
          'Bin',
          metrics[j].unit,
          metrics[j].bins.start[k],
          metrics[j].bins.end[k],
          data[metrics[j].offset[0] + k][locationOffsets[i] + metrics[j].offset[1]]
        ])
      }
    }
  }

  return Papa.unparse(output)
}

/**
 * Return confidence ranges and point prediction for given series
 * @param {Array} series an array of (bin start, bin end, value) triplets
 * @returns {Object} object with keys 'low', 'high' and 'point'
 */
const parseSeries = (series) => {
  let len = series.length

  // Both end trimming values for confidence intervals
  let confidenceTrims = [0.05, 0.25]

  // Handle edge case for season onset 'none' bin
  if (series[len - 1][0] == 'none') {
    len -= 1
  }

  let accumulator = {
    low: 0,
    high: 0
  }
  let range = {
    low: [null, null],
    high: [null, null]
  }
  let maxIdx = 0,
      maxValue = series[maxIdx][2]

  // Checking if everything is same
  let matches = 0

  for (let i = 0; i < len; i++) {
    // Look for max
    if (series[i][2] > maxValue) {
      maxIdx = i
      maxValue = series[maxIdx][2]
    }

    // Skip last value which can be (slightly) different
    if ((i < (len - 1)) && (series[0][2] == series[i][2])) {
      matches += 1
    }

    // Update accumulators
    // if (!range.low[1])
      accumulator.low += series[i][2]
    // if (!range.high[1])
      accumulator.high += series[len - i - 1][2]

    if ((accumulator.low > confidenceTrims[0]) && (!range.low[0]))
      range.low[0] = series[i][0]
    if ((accumulator.high > confidenceTrims[0]) && (!range.high[0]))
      range.high[0] = series[len - i - 1][1]

    if ((accumulator.low > confidenceTrims[1]) && (!range.low[1]))
      range.low[1] = series[i][0]
    if ((accumulator.high > confidenceTrims[1]) && (!range.high[1]))
      range.high[1] = series[len - i - 1][1]
  }

  if (matches === (len - 1)) {
    // No actual prediction, skip these
    return {
      low: [-1, -1],
      high: [-1, -1],
      point: -1
    }
  }
  else {
    return {
      low: range.low,
      high: range.high,
      point: series[maxIdx][0]
    }
  }
}

/**
 * Return json representation of long format data.
 * @param {string} longFormat long format csv content
 * @returns {Object} json pbject
 */
const longToJson = (longFormat) => {
  let data = Papa.parse(longFormat, {
    dynamicTyping: true
  })

  data = data.data

  let output = []

  // Hot start last target accumulator
  let accumulator = {
    region: data[1][0],
    target: data[1][1],
    point: data[1][6],
    bins: []
  }

  // Start after leaving the first (collected) row and header
  for (let i = 2; i < data.length; i++) {
    if ((data[i][2] == "Point") || (i == (data.length - 1))) {
      // Whenever we reach another point prediction or at end,
      // pack up last data and push to output
      let parsed = parseSeries(accumulator.bins)
      accumulator.low = parsed.low
      accumulator.high = parsed.high

      // If point prediction is NA, use the calculated one
      if ((accumulator.point == '') || (accumulator.point == 'NA')) {
        accumulator.point = parsed.point
      }
      delete accumulator.bins
      output.push(accumulator)
      // Reset accumulator
      accumulator = {
        region: data[i][0],
        target: data[i][1],
        point: data[i][6],
        bins: []
      }
    } else {
      accumulator.bins.push([data[i][4], data[i][5], data[i][6]])
    }
  }

  return output
}

exports.wideToLong = wideToLong
exports.longToJson = longToJson
