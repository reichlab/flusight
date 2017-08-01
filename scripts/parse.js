/**
 * Module for handling `yarn run parse`
 * Generate following data files in ./src/assets/data/
 * - history.json :: historical data for regions
 * - metadata.json :: metadata for regions with season prediction availability
 * - season-XXXX.json :: main data for season XXXX
 */

const actual = require('./modules/actual')
const region = require('./modules/region')
const transform = require('./modules/transform')
const baseline = require('./modules/baseline')
const stats = require('./modules/stats')
const utils = require('./utils')
const fs = require('fs-extra')
const path = require('path')
const moment = require('moment')
const ProgressBar = require('progress')

// Setup variables
const dataDirectory = './data'
const baselineFile = './scripts/assets/wILI_Baseline.csv'
const historyInFile = './scripts/assets/history.json'
const historyOutFile = './src/assets/data/history.json'
const metaOutFile = './src/assets/data/metadata.json'
const outputFile = './src/assets/data/data.json'

console.log('\n ----------------------------------')
console.log(' Generating data files for flusight')
console.log(' ----------------------------------\n')

// H I S T O R Y . J S O N
if (!fs.existsSync(historyInFile)) {
  // TODO: A-U-T-O-M-A-T-E
  console.log(' ✕ History file not found. Run `yarn run get-history` to fetch it')
  process.exit(1)
} else {
  fs.copySync(historyInFile, historyOutFile)
  console.log(' ✓ Wrote history.json\n')
}

// M E T A D A T A . J S O N
// Look for seasons in the data directory
let seasons = utils.getSubDirectories(dataDirectory)

// Stop if no folder found
if (seasons.length === 0) {
  console.log(' ✕ No seasons found in data directory!')
  process.exit(1)
}

// Print seasons
console.log(` Found ${seasons.length} seasons:`)
seasons.forEach(s => console.log(' ' + s))
console.log('')

fs.writeFileSync(metaOutFile, JSON.stringify({
  regionData: region.regionData,
  seasonIds: seasons,
  updateTime: moment.utc(new Date()).format('MMMM Do YYYY, hh:mm:ss')
}))
console.log(' ✓ Wrote metadata.json\n')

// D A T A . J S O N
// Bootstrap output as a list
let output = region.regionData.map(d => {
  return {
    id: d.id
  }
})

// Crete cache for file data
let cachedCSVs = {}
// season -> model -> week
seasons.forEach(season => {
  cachedCSVs[season] = {}
})

// Get baseline data
let baselineData = baseline.getBaselines(baselineFile)

console.log(' Gathering actual data for the seasons...')

// Get actual data for seasons
actual.getActual(seasons, actualData => {
  // Add seasons to output
  console.log('\n Parsing regions...')
  let progressBar = new ProgressBar(' :bar :current of :total', {
    complete: '▇',
    incomplete: '-',
    total: 11
  })

  output.forEach(val => {
    progressBar.tick()

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
            data = transform.csvToJson(fs.readFileSync(fileName, 'utf8'))
            cachedCSVs[season][model][sweek] = data
          }
          // Take only for the current region
          let filtered = utils.regionFilter(data, regionDataObject[val.id].subId)
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
        baseline: baselineData[regionDataObject[val.id].subId][season]
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
          regionDataObject[val.id].subId
        )
      })
    })
  })

  fs.writeFileSync(outputFile, JSON.stringify(output))
  console.log('\n ✓ All done! data.json saved at ' + outputFile)
})
