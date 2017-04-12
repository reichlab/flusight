/**
 * Common utility functions
 */

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const mmwr = require('mmwr-week')

/**
 * Skip points which are not that important by calculating simple
 * importance values
 */
const compressArray = (array, ratio) => {
  let importances = Array(array.length).fill([0, 0])
  // We will keep the first and the last value
  importances[0] = [0, 100]
  importances[array.length - 1] = [array.length - 1, 100]

  for (let i = 1; i < array.length - 1; i++) {
    importances[i] = [i, array[i] - (array[i - 1] + array[i + 1]) / 2]
  }

  importances.sort((a, b) => (a[1] - b[1]))

  // Skip values
  let skip = array.length - Math.floor(ratio * array.length)
  return importances.slice(skip).map(imp => [imp[0], array[imp[0]]])
}

/**
 * Regenerate array in the compressed representation
 * Assume its a probability distribution and so it sums to one
 */
const deCompressArray = compArray => {
  let array = Array(Math.max(...compArray.map(i => i[0]))).fill(0)

  let clamped = []
  // Fill in given values
  compArray.forEach(item => {
    array[item[0]] = item[1]
    clamped.push(item[0])
  })

  let epsilon = 0.00000001 // Try to acheive 1e-8 error
  let alpha = 1
  let maxIter = 100
  let sum, error

  for (let i = 0; i < maxIter; i++) {
    sum = array.reduce((a, b) => (a + b), 0)
    error = 1 - sum
    console.log(error)
    if (Math.abs(error) < epsilon) {
      break
    } else {
      // Neighbour filling
      for (let j = 1; j < array.length - 1; j++) {
        if (clamped.indexOf(j) === -1) {
          array[j] += alpha * error * (array[j - 1] + array[j + 1]) / 2
        }
      }
    }
  }

  return array
}

/**
 * Return list of weekStamps in given mmwr season
 */
const seasonToWeekStamps = season => {
  let first = parseInt(season.split('-')[0])
  let second = parseInt(season.split('-')[1])

  // Check the number of weeks in first year
  let firstYear = new mmwr.MMWRDate(first)
  let firstMaxWeek = firstYear.nWeeks

  let weeks = []
  // Weeks for first year
  for (let i = 30; i <= firstMaxWeek; i++) {
    weeks.push(parseInt(first + '' + i))
  }

  // Weeks for second year
  for (let i = 1; i < 30; i++) {
    let week
    if (i < 10) week = parseInt(second + '0' + i)
    else week = parseInt(second + '' + i)
    weeks.push(week)
  }
  return weeks
}

/**
 * Convert given weekstamp to index depending on the season
 */
const weekToIndex = (week, seasonWeekStamps) => {
  let seasonWeeks = seasonWeekStamps.map(st => st % 100)
  let wInt = Math.floor(week)
  if (wInt === 0) wInt = Math.max(...seasonWeeks)
  if (wInt === 53) wInt = 1
  return seasonWeeks.indexOf(wInt)
}

/**
 * Return all subdirectoies in given directory
 * @param {string} directory root directory
 * @returns {Array} list of subdirectory
 */
const getSubDirectories = directory => {
  return fs.readdirSync(directory).filter(file => {
    return fs.statSync(path.join(directory, file)).isDirectory()
  })
}

/**
 * Return all csv files (parsing to integer names) in directory
 * @param {string} directory root directory
 * @returns {Array} list of .csv files
 */
const getWeekFiles = directory => {
  let newFiles = fs.readdirSync(directory)
      .filter(f => f.endsWith('.csv'))
  return newFiles.map(file => parseInt(file.split()[0]))
}

/**
 * Filter data returned from tranform.longToJson according to region
 * @param {Array} data data returned from longToJson
 * @param {string} region region identifier to filter on
 * @returns {Object} an object with output for the region
 */
const regionFilter = (data, region) => {
  // Exploiting the fact that we know the structure of prediction at each week,
  // we generate the optimal structure for foresight
  let filtered = {
    series: [null, null, null, null],
    peakTime: null,
    peakValue: null,
    onsetTime: null,
    bins: null
  }

  // Convert week ahead targets to simple series
  let weekAheadTargets = ['oneWk', 'twoWk', 'threeWk', 'fourWk']

  data.filter(d => d.region === region).forEach(d => {
    let wAIdx = weekAheadTargets.indexOf(d.target)

    let compressedBins = null
    if (d.bins) {
      // compressedBins = compressArray(d.bins.map(b => b[2]), 0.1)
    }
    if (wAIdx > -1) {
      filtered.series[wAIdx] = {
        point: d.point,
        low: d.low,
        high: d.high,
        bins: compressedBins
      }
    } else {
      filtered[d.target] = {
        point: d.point,
        low: d.low,
        high: d.high,
        bins: compressedBins
      }
    }
  })

  // Assuming all the predictions are not present when one wk isn't
  if (filtered.series[0].point > -1) return filtered
  else return -1
}

/**
 * Get model metadata
 * @param {string} submissionDir path to the submission directory
 * @returns {Object} metadata object
 */
const getModelMeta = submissionDir => {
  let meta = {
    name: 'No metadata found',
    description: '',
    url: ''
  }

  let metaFiles = ['meta.yaml', 'meta.yml']

  for (let i = 0; i < metaFiles.length; i++) {
    try {
      let filePath = path.join(submissionDir, metaFiles[i])
      meta = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))
    } catch (e) {
      continue
    }
  }

  return meta
}

/**
 * Get data with maximum lag
 * First element of the lag array
 */
const getMaxLagData = actual => {
  return actual.map(d => {
    let dataToReturn = -1
    // Handle zero length values
    if (d.data.length !== 0) {
      dataToReturn = d.data[0].value
    }
    return {
      week: d.week,
      data: dataToReturn
    }
  })
}

exports.getSubDirectories = getSubDirectories
exports.regionFilter = regionFilter
exports.getWeekFiles = getWeekFiles
exports.getModelMeta = getModelMeta
exports.getMaxLagData = getMaxLagData
exports.seasonToWeekStamps = seasonToWeekStamps
exports.weekToIndex = weekToIndex

exports.compressArray = compressArray
exports.deCompressArray = deCompressArray
