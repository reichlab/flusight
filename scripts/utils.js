/**
 * Common utility functions
 */

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

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
    onsetTime: null
  }

  // Convert week ahead targets to simple series
  let weekAheadTargets = ['oneWk', 'twoWk', 'threeWk', 'fourWk']

  data.filter(d => d.region === region).forEach(d => {
    let wAIdx = weekAheadTargets.indexOf(d.target)
    if (wAIdx > -1) {
      filtered.series[wAIdx] = {
        point: d.point,
        low: d.low,
        high: d.high
      }
    } else {
      filtered[d.target] = {
        point: d.point,
        low: d.low,
        high: d.high
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
