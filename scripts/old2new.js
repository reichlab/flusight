// Module for converting old format (wide) submission file to new format (long)

const Papa = require('papaparse')

const transform = (oldFormat) => {
  let data = Papa.parse(oldFormat, {
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


exports.transform = transform
