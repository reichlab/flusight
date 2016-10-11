// Module for converting a 'new' submission file to a prediction snapshot
// A file is supposed to contain data for one season, model and epidemic week

const Papa = require('papaparse')
const meta = require('./meta')

// Return low and high (90%) confidence values for given bins and values
const getRange = (bins) => {
  let len = bins.length

  // Handle edge case for season onset 'none' bin
  if (bins[len - 1][0] == 'none') {
    bins.splice(-1, 1)
    len -= 1
  }

  let lowAccu = highAccu = 0
  let rangeLow = rangeHigh = null

  for (let i = 0; i < len; i++) {
    if (!rangeLow) lowAccu += bins[i][2]
    if (!rangeHigh) highAccu += bins[len - i - 1][2]

    if (lowAccu > 0.05) {
      rangeLow = bins[i][0]
    }

    if (highAccu > 0.05) {
      rangeHigh = bins[len - i - 1][1]
    }

    if (rangeHigh & rangeLow) {
      break
    }
  }
  return [rangeLow, rangeHigh]
}

// Take new format csv content as string input (and other metadata)
// Return the container with new data
const transform = (newFormatData, season, modelName, week, container) => {
  let data = Papa.parse(newFormatData, {
    dynamicTyping: true
  })

  // Remove headers
  data = data.data
  data.splice(0, 1)

  // Create output data structure
  let output = []

  // Hot start last target accumulator
  let accumulator = {
    region: data[0][0],
    target: data[0][1],
    point: data[0][6],
    bins: []
  }

  // Start after leaving the first (collected) row
  for (let i = 1; i < data.length; i++) {
    if ((data[i][2] == "Point") || (i == (data.length - 1))) {
      // Whenever we reach another point prediction or at end,
      // pack up last data and push to output
      let range = getRange(accumulator.bins)
      accumulator.low = range[0]
      accumulator.high = range[1]
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

exports.transform = transform
