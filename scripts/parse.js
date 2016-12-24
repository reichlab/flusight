/**
 * Module for handling `yarn run parse`
 * Uses ./modules and generate data.json
 */

const actual = require('./modules/actual')
const metadata = require('./modules/metadata')
const transform = require('./modules/transform')
const preprocess = require('./modules/preprocess')
const baseline = require('./modules/baseline')
const history = require('./modules/history')
const stats = require('./modules/stats')
const utils = require('./utils')

const fs = require('fs')
const path = require('path')
const moment = require('moment')

const config = require('./config').read('./config.yaml')

// Setup variables
const branding = config.branding
const dataDirectory = './data'
const baselineFile = './scripts/assets/wILI_Baseline.csv'
const historyFile = './scripts/assets/history.json'
const outputFile = './src/assets/data.json'

// Caches CSV files
let cachedCSVs = {}

// Preprocess data directory and then generate data.json
preprocess.processWide(dataDirectory, () => {
  // Look for seasons in the data directory
  let seasons = utils.getSubDirectories(dataDirectory)

  // Stop if no folder found
  if (seasons.length === 0) {
    console.log('No seasons found in data directory!')
    process.exit(1)
  }

  // Print seasons
  console.log('Found ' + seasons.length + ' seasons:')
  seasons.map(s => console.log(s))
  console.log('')

  // Bootstrap output
  let output = metadata.regions

  // Get baseline data
  let baselineData = baseline.getBaselines(baselineFile)

  // Get historical data
  let historicalData = history.getHistory(historyFile)

  console.log('Gathering actual data for the seasons...')

  // Get actual data for seasons
  actual.getActual(seasons, actualData => {
    // Add seasons to output
    output.forEach(val => {
      console.log('Parsing region: ' + val.region)

      // Append historical data to region
      val.history = historicalData[val.id]

      val.seasons = seasons.map(season => {
        // Get models for each season
        let modelsDir = utils.getSubDirectories(path.join(dataDirectory, season))
        let models = modelsDir.map(model => {
          // Get prediction weeks for each model
          let weeks = utils.getWeekFiles(path.join(dataDirectory, season, model))
          let modelMeta = utils.getModelMeta(path.join(dataDirectory, season, model))

          let modelPredictions = weeks.map(week => {
            let fileName = path.join(dataDirectory, season, model, week + '.csv')
            let data = null
            // Take from cache to avoid file reads
            if (cachedCSVs[fileName]) {
              data = cachedCSVs[fileName]
            } else {
              data = transform.longToJson(fs.readFileSync(fileName, 'utf8'))
              cachedCSVs[fileName] = data
            }
            // Take only for the current region
            let filtered = utils.regionFilter(data, val.subId)
            if (filtered === -1) return -1
            else {
              filtered.week = week
              return filtered
            }
          }).filter(skipData => skipData !== -1)

          let modelStats = stats.getModelStats(
            modelPredictions,
            utils.getMaxLagData(actualData[val.id][season])
          )

          return {
            id: model,
            meta: modelMeta,
            stats: modelStats,
            predictions: modelPredictions
          }
        })
        return {
          id: season,
          actual: actualData[val.id][season],
          models: models,
          baseline: baselineData[val.subId][season]
        }
      })
    })

    // Add current time
    branding.updateTime = moment.utc(new Date()).format('MMMM Do YYYY, hh:mm:ss')
    let outputWithYamlData = {
      data: output,
      branding: branding
    }

    fs.writeFile(outputFile, JSON.stringify(outputWithYamlData, null, 2), err => {
      if (err) return console.log(err)
      else return console.log('\nAll done! JSON saved at ' + outputFile)
    })
  })
})
