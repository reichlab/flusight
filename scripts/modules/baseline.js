/**
 * Reader for baseline csv file
 */

const Papa = require('papaparse')
const fs = require('fs')
const region = require('./region')

/**
 * Return an object with region, season keyed baselines
 */
const getBaselines = baselineFile => {
  if (!fs.existsSync(baselineFile)) {
    console.log('Baseline file not found. Run `yarn run get-baseline` to fetch it')
    process.exit(1)
  }

  let data = Papa.parse(fs.readFileSync(baselineFile, 'utf8'), {
    dynamicTyping: true
  }).data

  let regionSubIds = region.regionData.map(d => d.subId)
  let seasons = data[0]
      .filter(d => d.length !== 0)
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
