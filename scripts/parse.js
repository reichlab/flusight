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
const ProgressBar = require('progress')

const config = require('./config').read('./config.yaml')

// Setup variables
const branding = config.branding
const dataDirectory = './data'
const baselineFile = './scripts/assets/wILI_Baseline.csv'
const historyFile = './scripts/assets/history.json'
const actualCacheFile = './scripts/assets/actual-cache.json'
const outputFile = './src/assets/data.json'

// Preprocess data directory and then generate data.json
preprocess.processWide(dataDirectory, () => {
  // Look for seasons in the data directory
  let seasons = utils.getSubDirectories(dataDirectory)

  console.log('\n ---------------------------------')
  console.log(' Generating data.json for flusight')
  console.log(' ---------------------------------\n')
  // Stop if no folder found
  if (seasons.length === 0) {
    console.log(' No seasons found in data directory!')
    process.exit(1)
  }

  // Print seasons
  console.log(` Found ${seasons.length} seasons:`)
  seasons.map(s => console.log(' ' + s))
  console.log('')

  // Bootstrap output
  let output = metadata.regions

  // Crete cache for file data
  let cachedCSVs = {}
  // season -> model -> week
  seasons.forEach(season => {
    cachedCSVs[season] = {}
  })

  // Get baseline data
  let baselineData = baseline.getBaselines(baselineFile)

  // Get historical data
  let historicalData = history.getHistory(historyFile)

  console.log(' Gathering actual data for the seasons...')

  // Get actual data for seasons
  actual.getActual(seasons, actualCacheFile, actualData => {
    // Add seasons to output
    console.log('\n Parsing regions...')
    let progressBar = new ProgressBar(' :bar :current of :total', {
      complete: '▇',
      incomplete: '-',
      total: 11
    })

    output.forEach(val => {
      progressBar.tick()

      // Append historical data to region
      val.history = historicalData[val.id]

      val.seasons = seasons.map(season => {
        // Get models for each season
        let modelsDir = utils.getSubDirectories(path.join(dataDirectory, season))
        let models = modelsDir.map(model => {
          // Bootstrap cache
          if (!(model in cachedCSVs[season])) {
            cachedCSVs[season][model] = {}
          }

          // Get prediction weeks for each model
          let weekStamps = utils.getWeekFiles(path.join(dataDirectory, season, model))
          let modelMeta = utils.getModelMeta(path.join(dataDirectory, season, model))
          let seasonWeekStamps = utils.seasonToWeekStamps(season)

          let modelPredictions = seasonWeekStamps.map((sweek, index) => {
            if (weekStamps.indexOf(sweek) === -1) {
              // Prediction not available for this week, return null
              return null
            }

            let fileName = path.join(dataDirectory, season, model, sweek + '.csv')
            let data = null
            // Take from cache to avoid file reads
            if (sweek in cachedCSVs[season][model]) {
              data = cachedCSVs[season][model][sweek]
            } else {
              data = transform.longToJson(fs.readFileSync(fileName, 'utf8'))
              cachedCSVs[season][model][sweek] = data
            }
            // Take only for the current region
            let filtered = utils.regionFilter(data, val.subId)
            if (filtered === -1) return null
            else {
              // Transform weeks predictions to season indices
              let timeTargets = ['peakTime', 'onsetTime']
              timeTargets.forEach(t => {
                filtered[t].point = utils.weekToIndex(filtered[t].point, seasonWeekStamps)
                filtered[t].high = filtered[t].high.map(val => utils.weekToIndex(val, seasonWeekStamps))
                filtered[t].low = filtered[t].low.map(val => utils.weekToIndex(val, seasonWeekStamps))
              })
              return filtered
            }
          })

          return {
            id: model,
            meta: modelMeta,
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

    // Add model metadata
    console.log('\n Calculating model statistics')
    output.forEach(val => {
      val.seasons.forEach(season => {
        season.models.forEach(model => {
          model.stats = stats.getModelStats(
            cachedCSVs[season.id][model.id],
            utils.getMaxLagData(actualData[val.id][season.id]),
            val.subId
          )
        })
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
      else return console.log('\n All done! JSON saved at ' + outputFile)
    })
  })
})
