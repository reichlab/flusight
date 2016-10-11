// Convert data files for ingestion
//
// Specifically, tranform ../data and ../config.yaml
// and create static assets in ../src/assets for ingestion

const path = require('path')
const ora = require('ora')
const generateData = require('../scripts/generateData')

var spinner = ora("Parsing files...\n\n")
spinner.start()

generateData.generate('./data/', () => {
  spinner.stop()
  console.log('All done')
})
