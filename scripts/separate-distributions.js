/**
 * Script for separating distribution data from season data file
 * Currently this works on the season files generated by parse-season step so as to
 * not disturb anything working (and also to avoid reparsing the csvs again)
 *
 * In its final form, this step will go inside parse-season
 */

const fs = require('fs')
const path = require('path')
const utils = require('./utils')

// Variables and paths
const dataDir = './data'
const outDir = './src/assets/data/distributions'

// Check for all seasons in the data directory
let seasons = utils.getSubDirectories(dataDir)

// Take season id from command line
let seasonInFile = process.argv[2]

// Get rid of point values from a prediction object
const filterPrediction = prediction => {
  const takeOnlyBins = p => {
    return {
      bins: p.bins
    }
  }
  if (prediction) {
    return {
      series: prediction.series.map(takeOnlyBins),
      peakTime: takeOnlyBins(prediction.peakTime),
      onsetTime: takeOnlyBins(prediction.onsetTime),
      peakValue: takeOnlyBins(prediction.peakValue)
    }
  } else {
    return null
  }
}

// Extract bin data for all regions in given season data
const extractDistributions = seasonData => {
  return seasonData.regions.map(reg => {
    return {
      seasonId: seasonData.seasonId,
      regionId: reg.id,
      models: reg.models.map(mod => {
        return {
          id: mod.id,
          predictions: mod.predictions.map(filterPrediction)
        }
      })
    }
  })
}

// Delete bins from seasonData
const deleteDistributions = seasonData => {
  seasonData.regions.forEach(reg => {
    reg.models.forEach(mod => {
      mod.predictions.forEach(pred => {
        if (pred) {
          delete pred.peakTime.bins
          delete pred.onsetTime.bins
          delete pred.peakValue.bins
          pred.series.forEach(s => delete s.bins)
        }
      })
    })
  })
  return seasonData
}

let seasonData = JSON.parse(fs.readFileSync(seasonInFile), 'utf8')
extractDistributions(seasonData).forEach(regionData => {
  // If the season is latest and region is nat, save as `latest-nat`.
  // This chunk will get loaded directly with the main app.
  let outputFile
  if ((seasons.indexOf(regionData.seasonId) === seasons.length - 1) && (regionData.regionId === 'nat')) {
    outputFile = path.join(outDir, 'season-latest-nat.json')
  } else {
    outputFile = path.join(outDir, `season-${regionData.seasonId}-${regionData.regionId}.json`)
  }
  fs.writeFile(outputFile, JSON.stringify(regionData), err => {
    if (err) {
      throw err
    }
    console.log(` Distributions file written at ${outputFile}`)
  })
})

// Write clipped seasonData file
fs.writeFile(seasonInFile, JSON.stringify(deleteDistributions(seasonData)), err => {
  if (err) {
    throw err   
  }
  console.log(' Cropped data file written')
})