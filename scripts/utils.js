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
const getSubDirectories = (directory) => {
  return fs.readdirSync(directory).filter(file => {
    return fs.statSync(path.join(directory, file)).isDirectory()
  })
}

/**
 * Return all csv files (parsing to integer names) in directory
 * @param {string} directory root directory
 * @returns {Array} list of .csv files
 */
const getWeekFiles = (directory) => {
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
  let filtered = {}

  data.filter(d => d.region === region).forEach((d, idx) => {
    filtered[d.target] = {
      point: d.point,
      low: d.low,
      high: d.high
    }
  })

  // Assuming all the predictions are not present when one isn't
  if (filtered.oneWk.point === -1) return -1
  else return filtered
}

/**
 * Get model metadata
 * @param {string} submissionDir path to the submission directory
 * @returns {Object} metadata object
 */
const getModelMeta = (submissionDir) => {
  let meta = {
    name: 'No metadata found',
    description: '',
    url: ''
  }

  let metaFiles = ['meta.yaml', 'meta.yml']

  for (let i = 0; i < metaFiles.length; i++) {
    try {
      meta = yaml.safeLoad(fs.readFileSync(path.join(submissionDir,
                                                     metaFiles[i]), 'utf8'))
    } catch (e) {
      continue
    }
  }

  return meta
}

exports.getSubDirectories = getSubDirectories
exports.regionFilter = regionFilter
exports.getWeekFiles = getWeekFiles
exports.getModelMeta = getModelMeta
