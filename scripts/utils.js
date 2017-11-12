/**
 * Common utility functions
 */

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const mmwr = require('mmwr-week')

const readYaml = filePath => {
  return yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))
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
  // TODO: Is this going to be right for 2014-2015?
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
 * Group bins for display
 */
const groupTargetBins = values => {
  const groupSum = (array, groupSize) => {
    return array.reduce((acc, val, idx) => {
      acc[Math.floor(idx / groupSize)] += val
      return acc
    }, Array(array.length / groupSize).fill(0))
  }

  if (values.length === 131) {
    // newer format bin values
    return groupSum(values.slice(0, values.length - 1), 5)
  } else if (values.length === 27) {
    // older format bin values
    return groupSum(values.slice(0, values.length - 1), 2)
  } else if (values.length < 40) {
    // week values
    return groupSum(values, 1)
  } else {
    throw new RangeError('Unknown length of bins : ' + values.length)
  }
}

/**
 * Filter data returned from tranform.csvToJson according to region
 * @param {Array} data data returned from csvToJson
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
    onsetTime: null
  }

  // Convert week ahead targets to simple series
  let weekAheadTargets = ['oneWk', 'twoWk', 'threeWk', 'fourWk']

  data.filter(d => d.region === region).forEach(d => {
    let wAIdx = weekAheadTargets.indexOf(d.target)

    let parsedBins = null
    if (d.bins) {
      parsedBins = groupTargetBins(d.bins.map(b => b[2]))
    }
    if (wAIdx > -1) {
      filtered.series[wAIdx] = {
        point: d.point,
        low: d.low,
        high: d.high,
        bins: parsedBins
      }
    } else {
      filtered[d.target] = {
        point: d.point,
        low: d.low,
        high: d.high,
        bins: parsedBins
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
      meta = readYaml(filePath)
    } catch (e) {
      continue
    }
  }

  return meta
}

// Get rid of point values from a prediction object
const filterPrediction = prediction => {
  const takeOnlyBins = p => {
    return {
      bins: p.bins
    }
  }
  if (prediction) {
    return {
      series: prediction.series.map(takeOnlyBins),
      peakTime: takeOnlyBins(prediction.peakTime),
      onsetTime: takeOnlyBins(prediction.onsetTime),
      peakValue: takeOnlyBins(prediction.peakValue)
    }
  } else {
    return null
  }
}

// Extract bin data for all regions in given season data
const extractDistributions = seasonData => {
  return seasonData.regions.map(reg => {
    return {
      seasonId: seasonData.seasonId,
      regionId: reg.id,
      models: reg.models.map(mod => {
        return {
          id: mod.id,
          predictions: mod.predictions.map(filterPrediction)
        }
      })
    }
  })
}

// Delete bins from seasonData
const deleteDistributions = seasonData => {
  seasonData.regions.forEach(reg => {
    reg.models.forEach(mod => {
      mod.predictions.forEach(pred => {
        if (pred) {
          delete pred.peakTime.bins
          delete pred.onsetTime.bins
          delete pred.peakValue.bins
          pred.series.forEach(s => delete s.bins)
        }
      })
    })
  })
  return seasonData
}

exports.readYaml = readYaml
exports.getSubDirectories = getSubDirectories
exports.regionFilter = regionFilter
exports.getWeekFiles = getWeekFiles
exports.getModelMeta = getModelMeta
exports.seasonToWeekStamps = seasonToWeekStamps
exports.weekToIndex = weekToIndex
exports.extractDistributions = extractDistributions
exports.deleteDistributions = deleteDistributions
