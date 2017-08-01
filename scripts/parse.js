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

// Setup variables
const dataDirectory = './data'
const baselineFile = './scripts/assets/wILI_Baseline.csv'
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

// S E A S O N - X X X X - X X X X . J S O N
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

// Get baseline data
let baselineData = baseline.getBaselines(baselineFile)

// Create cache for file data
let cachedCSVs = {}
// season -> model -> week
seasons.forEach(seasonId => {
  cachedCSVs[seasonId] = {}
})

// Write separate files for each season
seasons.forEach((seasonId, seasonIdx) => {
  let seasonOutFile
  if (seasonIdx === seasons.length - 1) {
    seasonOutFile = './src/assets/data/season-latest.json'
  } else {
    seasonOutFile = `./src/assets/data/season-${seasonId}.json`
  }
  actual.getActual([seasonId], actualData => {
    console.log(`\n Parsing data for season ${seasonId}...`)
    let output = {
      seasonId: seasonId,
      regions: []
    }

    output.regions = region.regionData.map(reg => {
      // Get models for each season
      let modelsDir = utils.getSubDirectories(path.join(dataDirectory, seasonId))
      let models = modelsDir.map(model => {
        // Bootstrap cache
        if (!(model in cachedCSVs[seasonId])) {
          cachedCSVs[seasonId][model] = {}
        }

        // Get prediction weeks for each model
        let weekStamps = utils.getWeekFiles(path.join(dataDirectory, seasonId, model))
        let modelMeta = utils.getModelMeta(path.join(dataDirectory, seasonId, model))
        let seasonWeekStamps = utils.seasonToWeekStamps(seasonId)

        let modelPredictions = seasonWeekStamps.map((sweek, index) => {
          if (weekStamps.indexOf(sweek) === -1) {
            // Prediction not available for this week, return null
            return null
          }

          let fileName = path.join(dataDirectory, seasonId, model, sweek + '.csv')
          let data = null
          // Take from cache to avoid file reads
          if (sweek in cachedCSVs[seasonId][model]) {
            data = cachedCSVs[seasonId][model][sweek]
          } else {
            data = transform.csvToJson(fs.readFileSync(fileName, 'utf8'))
            cachedCSVs[seasonId][model][sweek] = data
          }
          // Take only for the current region
          let filtered = utils.regionFilter(data, reg.subId)
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
        id: reg.id,
        actual: actualData[reg.id][seasonId],
        models: models,
        baseline: baselineData[reg.subId][seasonId]
      }
    })

    // Add model metadata
    console.log('\n Calculating model statistics')

    region.regionData.forEach((reg, regionIdx) => {
      output.regions[regionIdx].models.forEach(model => {
        model.stats = stats.getModelStats(
          cachedCSVs[seasonId][model.id],
          utils.getMaxLagData(actualData[reg.id][seasonId]),
          reg.subId
        )
      })
    })

    fs.writeFileSync(seasonOutFile, JSON.stringify(output))
    console.log('\n ✓ .json saved at ' + seasonOutFile)
  })
})

// M E T A D A T A . J S O N
fs.writeFileSync(metaOutFile, JSON.stringify({
  regionData: region.regionData,
  seasonIds: seasons,
  updateTime: moment.utc(new Date()).format('MMMM Do YYYY, hh:mm:ss')
}))
console.log(' ✓ Wrote metadata.json')
