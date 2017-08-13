/**
 * Script for downloading actual data files
 * Files are kept in ./scripts/assets/<season-id>-actual.json
 */

const actual = require('./modules/actual')
const utils = require('./utils')
const path = require('path')
const fs = require('fs')

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

seasons.forEach((seasonId, seasonIdx) => {
  let seasonOutFile = path.join(outputDir, `${seasonId}-actual.json`)

  console.log(` Downloading data for ${seasonId}`)
  actual.getActual([seasonId], actualData => {
    fs.writeFile(seasonOutFile, JSON.stringify(actualData), (err) => {
      if (err) throw err
      console.log(` ✓ File written at ${seasonOutFile}`)
    })
  })
})
