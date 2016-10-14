// Module for getting season baselines

const Papa = require('papaparse')
const fs = require('fs')
const metadata = require('./metadata')

/**
 * Return an object with region, season keyed baselines
 * @param {string} baselineFile baseline csv file
 * @returns {Object} baseline object
 */
const getBaselines = (baselineFile) => {
  let data = Papa.parse(fs.readFileSync(baselineFile, 'utf8'), {
    dynamicTyping: true
  })

  data = data.data

  let regionSubIds = metadata.regions.map(d => d.subId)
  let seasons = data[0]
      .filter(d => d.length != 0)
      .map(d => d.replace('/', '-'))

  let output = {}

  // Skipping header (taking only 11 rows)
  for (let i = 0; i < regionSubIds.length; i++) {
    output[regionSubIds[i]] = {}
    for (let j = 0; j < seasons.length; j++) {
      output[regionSubIds[i]][seasons[j]] = data[i + 1][j + 1]
    }
  }

  return output
}

exports.getBaselines = getBaselines
