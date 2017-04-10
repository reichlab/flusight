/**
 * Module for format transformation from
 * - wide csv to long csv
 * - long csv to json
 */

const Papa = require('papaparse')
const d3 = require('d3')

/**
 * Convert wide format content to long.
 * @param {string} wideFormat wide format csv content
 * @returns {string} long format csv content
 */
const wideToLong = wideFormat => {
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
  let locations = data[0].filter(item => item !== '')

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
 * Return json representation of long format data.
 * @param {string} longFormat long format csv content
 * @returns {Object} json pbject
 */
const longToJson = longFormat => {
  let data = Papa.parse(longFormat, {
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

exports.wideToLong = wideToLong
exports.longToJson = longToJson
