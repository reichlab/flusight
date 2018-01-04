/**
 * Script for downloading actual data files
 * Files are kept in ./scripts/assets/<season-id>-actual.json
 */

const utils = require('./utils')
const path = require('path')
const fs = require('fs')
const fct = require('flusight-csv-tools')

// Variables and paths
const dataDir = './data'
const outputDir = './scripts/assets'

console.log(' Downloading actual data from delphi epidata API')
console.log(' -----------------------------------------------')
console.log(' Messages overlap due to concurrency. Don\'t read too much.\n')

// Look for seasons in the data directory
let seasons = utils.getSubDirectories(dataDir)

// Stop if no folder found
if (seasons.length === 0) {
  console.log(' ✕ No seasons found in data directory!')
  process.exit(1)
}

// Print seasons
console.log(` Found ${seasons.length} seasons:`)
seasons.forEach(s => console.log(' ' + s))
console.log('')

function getActual(season, callback) {
  fct.truth.getSeasonDataAllLags(parseInt(season.split('-')[0]))
    .then(d => {
      // Transfor data for the format used in flusight
      // TODO: Use the standard format set in fct
      fct.meta.regionIds.forEach(rid => {
        d[rid].forEach(({ epiweek, wili, lagData }, idx) => {
          d[rid][idx] = {
            week: epiweek,
            actual: wili,
            lagData: lagData.map(ld => {
              return { lag: ld.lag, value: ld.wili }
            })
          }
        })
      })
      callback(d)
    })
    .catch(e => {
      console.log(`Error while processing ${season}`)
      console.log(e)
      process.exit(1)
    })
}

seasons.forEach((seasonId, seasonIdx) => {
  let seasonOutFile = path.join(outputDir, `${seasonId}-actual.json`)

  console.log(` Downloading data for ${seasonId}`)
  getActual(seasonId, actualData => {
    fs.writeFile(seasonOutFile, JSON.stringify(actualData), (err) => {
      if (err) throw err
      console.log(` ✓ File written at ${seasonOutFile}`)
    })
  })
})
