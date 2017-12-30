/**
 * Script to parse and write data for a single season
 * This is supposed to be called in child processes via the main parse script
 */

const fs = require('fs')
const path = require('path')
const utils = require('./utils')
const region = require('./modules/region')
const stats = require('./modules/stats')
const baseline = require('./modules/baseline')
const fct = require('flusight-csv-tools')

// Variables and paths
const dataDir = './data'
const outDir = './src/assets/data'
const baselineFile = './scripts/assets/wILI_Baseline.csv'

// Get baseline data
let baselineData = baseline.getBaselines(baselineFile)

// Look for seasons in the data directory
let seasons = utils.getSubDirectories(dataDir)

// Take input file from command line argument
let seasonInFile = process.argv[2]
// Season actual files are named <season-id>-actual.json
let season = path.basename(seasonInFile).slice(0, -12)
let seasonId = parseInt(season.split('-')[0])

// Create cache for file data
let cachedCSVs = {}

let seasonOutFile
if (seasons.indexOf(season) === seasons.length - 1) {
  seasonOutFile = path.join(outDir, 'season-latest.json')
} else {
  seasonOutFile = path.join(outDir, `season-${season}.json`)
}

fs.readFile(seasonInFile, 'utf8', (err, fileData) => {
  if (err) throw err
  let actualData = JSON.parse(fileData)
  console.log(`\n Parsing data for season ${season}...`)
  let output = {
    seasonId: season, // NOTE: This id is full xxxx-yyyy type id
    regions: []
  }

  output.regions = region.regionData.map(reg => {
    // Get models for each season
    let modelsDir = utils.getSubDirectories(path.join(dataDir, season))
    let models = modelsDir.map(model => {
      // Bootstrap cache
      if (!(model in cachedCSVs)) {
        cachedCSVs[model] = {}
      }

      // Get prediction weeks for each model
      let weekStamps = utils.getWeekFiles(path.join(dataDir, season, model))
      let modelMeta = utils.getModelMeta(path.join(dataDir, season, model))
      let seasonWeekStamps = utils.seasonIdToWeekStamps(seasonId)

      let modelPredictions = seasonWeekStamps.map((sweek, index) => {
        if (weekStamps.indexOf(sweek) === -1) {
          // Prediction not available for this week, return null
          return null
        }

        let fileName = path.join(dataDir, season, model, sweek + '.csv')
        let csv = null
        // Take from cache to avoid file reads
        if (sweek in cachedCSVs[model]) {
          csv = cachedCSVs[model][sweek]
        } else {
          csv = new fct.Csv(fileName, sweek, model)
          cachedCSVs[model][sweek] = csv
        }

        return utils.regionFilterCsv(csv, reg.id, seasonWeekStamps)
      })

      return {
        id: model,
        meta: modelMeta,
        predictions: modelPredictions
      }
    })
    return {
      id: reg.id,
      actual: actualData[reg.id],
      models: models,
      baseline: baselineData[reg.subId][season]
    }
  })

  // Add model metadata
  console.log('\n Calculating model statistics')

  console.log(output)
  process.exit(1)

  region.regionData.forEach((reg, regionIndex) => {
    output.regions[regionIndex].models.forEach(model => {
      model.stats = stats.getModelStats(
        cachedCSVs[model.id],
        actualData[reg.id].map(weekData => {
          return {
            week: weekData.week,
            data: weekData.actual
          }
        }),
        reg.subId
      )
    })
  })

  // Separate distributions data from the models.
  // NOTE: This should happen somewhere above, but meh!
  utils.extractDistributions(output).forEach(regionData => {
    // If the season is latest and region is nat, save as `latest-nat`.
    // This chunk will get loaded directly with the main app.
    let outDir = './src/assets/data/distributions'
    let outputFile
    if ((seasons.indexOf(regionData.seasonId) === seasons.length - 1) && (regionData.regionId === 'nat')) {
      outputFile = path.join(outDir, 'season-latest-nat.json')
    } else {
      outputFile = path.join(outDir, `season-${regionData.seasonId}-${regionData.regionId}.json`)
    }
    fs.writeFile(outputFile, JSON.stringify(regionData), err => {
      if (err) throw err
      console.log(` Distributions file written at ${outputFile}`)
    })
  })

  fs.writeFile(seasonOutFile, JSON.stringify(utils.deleteDistributions(output)), (err) => {
    if (err) throw err
    console.log('\n ✓ .json saved at ' + seasonOutFile)
  })
})
