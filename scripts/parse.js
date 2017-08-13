/**
 * Module for handling `yarn run parse`
 * Generate following data files in ./src/assets/data/
 * - history.json :: historical data for regions
 * - metadata.json :: metadata for regions with season prediction availability
 * - season-XXXX.json :: main data for season XXXX
 */

const region = require('./modules/region')
const utils = require('./utils')
const fs = require('fs-extra')
const moment = require('moment')
const { exec } = require('child_process')

// Setup variables
const dataDir = './data' // Place with the CSVs
const historyInFile = './scripts/assets/history.json'
const historyOutFile = './src/assets/data/history.json'
const metaOutFile = './src/assets/data/metadata.json'

console.log('\n ----------------------------------')
console.log(' Generating data files for flusight')
console.log(' ----------------------------------\n')
console.log(' Messages overlap due to concurrency. Don\'t read too much.\n')

// H I S T O R Y . J S O N
if (!fs.existsSync(historyInFile)) {
  // TODO: A-U-T-O-M-A-T-E
  console.log(' ✕ History file not found. Run `yarn run get-history` to fetch it')
  process.exit(1)
} else {
  fs.copySync(historyInFile, historyOutFile)
  console.log(' ✓ Wrote history.json\n')
}

// Look for seasons in the data directory
let seasons = utils.getSubDirectories(dataDir)

// M E T A D A T A . J S O N
fs.writeFileSync(metaOutFile, JSON.stringify({
  regionData: region.regionData,
  seasonIds: seasons,
  updateTime: moment.utc(new Date()).format('MMMM Do YYYY, hh:mm:ss')
}))
console.log(' ✓ Wrote metadata.json')

// S E A S O N - X X X X - X X X X . J S O N

/**
 * Run a node subprocess to parse season
 */
function parseSeason (seasonId, callback) {
  exec(`node scripts/parse-season.js ${seasonId}`, (err) => {
    if (err) throw err
    callback()
  })
}

function parseSeasons (seasonIds) {
  if (seasonIds.length === 0) {
    console.log('All done')
  } else {
    console.log(` Running parse-season for ${seasonIds[0]}`)
    parseSeason(seasonIds[0], () => {
      parseSeasons(seasonIds.slice(1))
    })
  }
}

parseSeasons(seasons)
