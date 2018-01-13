/**
 * Script to parse and write data for a single season
 * This is supposed to be called in child processes via the main parse script
 */

const fs = require('fs')
const path = require('path')
const utils = require('./utils')
const fct = require('flusight-csv-tools')

// Directory with CSVs
const DATA_DIR = './data'
// Directory for output JSONs
const OUT_DIR = './src/assets/data'
// Look for seasons in the data directory
const SEASONS = utils.getSubDirectories(DATA_DIR)
// Take input season from command line argument
const SEASON_ID = process.argv[2]
const SEASON = `${SEASON_ID}-${SEASON_ID + 1}`
const MODELS_DIR = utils.getSubDirectories(path.join(DATA_DIR, SEASON))

// Cache for csv objects
// This is needed since the nesting in output (season, region, model)
// is not similar to whats in the input (season, model, region)
let CACHED_CSVS = {}

/**
 * Return season name for writing files
 */
function getSeasonName() {
  if (SEASONS.indexOf(SEASON) === SEASONS.length - 1) {
    return 'latest'
  } else {
    return SEASON
  }
}

async function writeSeasonFile(data) {
  await utils.writeJSON(path.join(DATA_DIR, `season-${getSeasonName()}.json`), data)
}

async function writeScoresFile(data) {
  await utils.writeJSON(path.join(DATA_DIR, `scores-${getSeasonName()}.json`, data))
}

async function writeDistsFile(data, regionId) {
  let distsDir = path.join(DATA_DIR, 'distributions')
  await fs.ensureDir(distsDir)

  let outputFile
  if (regionId === 'nat') {
    // We only use latest identifier in the latest AND nat data
    outputFile = path.join(distsDir, `season-${getSeasonName()}-nat.json`)
  } else {
    outputFile = path.join(distsDir, `season-${SEASON}-${regionId}.json`)
  }

  await utils.writeJSON(outputFile, data)
}

/**
 * Return region data with nulls filled in for missing epiweeks
 */
function parseRegionActual(seasonData, regionId) {
  let regionSubset = seasonData[regionId]

  let epiweeks = fct.utils.epiweek.seasonEpiweeks(SEASON_ID)
  return epiweeks.map(ew => {
    let { epiweek, wili, lagData } = regionSubset.find(({ epiweek }) => epiweek === ew)
    // Rename keys to match the expectations of flusight
    // and extend by filling in missing epiweeks
    if (epiweek) {
      return {
        week: epiweek,
        actual: wili,
        lagData: lagData.map(({ lag, wili }) => { return { lag, value: wili } })
      }
    } else {
      return {
        week: ew,
        actual: null,
        lagData: []
      }
    }
  })
}

/**
 * Return fct csv object for given specifications using the cache
 */
function getCsv (modelPath, epiweek) {
  let modelId = path.basename(modelPath)
  if (epiweek in CACHED_CSVS[modelId]) {
    return CACHED_CSVS[modelId][epiweek]
  } else {
    let csvFile = path.join(modelPath, epiweek + '.csv')
    let csv = new fct.Csv(csvFile, epiweek, modelId)
    CACHED_CSVS[modelId][epiweek] = csv
    return csv
  }
}

/**
 * Return formatted point data for the region using the cvs object
 */
function parsePointData (csv, regionId) {
  let seasonEpiweeks = fct.utils.epiweek.seasonEpiweeks(SEASON_ID)

  function getTargetData (target) {
    let cis = [90, 50]
    let point = csv.getPoint(target, regionId)
    let ranges = cis.map(c => csv.getConfidenceRange(target, regionId, c))
    let low = ranges.map(r => r[0])
    let high = ranges.map(r => r[1])

    if (['peak-wk', 'onset-wk'].indexOf(target) > -1) {
      // Return indices for time based targets
      point = utils.weekToIndex(point, seasonEpiweeks)
      high = high.map(d => utils.weekToIndex(d, seasonEpiweeks))
      low = low.map(d => utils.weekToIndex(d, seasonEpiweeks))
    }

    return { point, low, high }
  }

  return {
    series: [1, 2, 3, 4].map(getTargetData),
    peakValue: getTargetData('peak'),
    peakTime: getTargetData('peak-wk'),
    onsetTime: getTargetData('onset-wk')
  }
}

/**
 * Return bin data for the given region using the csv object
 */
function parseBinData (csv, regionId) {
  function getTargetData (target, binBatch) {
    let bins = csv.getBins(target, regionId)
    return {
      bins: fct.utils.bins.sliceSumBins(bins, binBatch).map(b => b[2])
    }
  }

  return {
    series: [1, 2, 3, 4].map(t => getTargetData(t, 5)),
    peakValue: getTargetData('peak', 5),
    peakTime: getTargetData('peak-wk', 1),
    onsetTime: getTargetData('onset-wk', 1)
  }
}

/**
 * Return formatted score data from the csv for a region
 */
function parseScoreData (csv, regionId, regionTruth) {
  return {
    series: [1, 2, 3, 4].map(t => getTargetData(t)),
    peakValue: getTargetData('peak'),
    peakTime: getTargetData('peak-wk'),
    onsetTime: getTargetData('onset-wk')
  }
}

/**
 * Return formatted data from the csv for a region
 * Each value (point, bin, score) is in the following structure
 * - series: [{}, {}, {}, {}]
 * - peakValue: {}
 * - peakTime: {}
 * - onsetTime: {}
 */
function parseCsv (csv, regionId, regionTruth) {
  return {
    pointData: parsePointData(csv, regionId),
    binData: parseBinData(csv, regionId),
    scoreData: parseScoreData(csv, regionId, regionTruth)
  }
}

/**
 * Aggregate the scores by taking average
 */
function aggregateScores (scores) {
  // TODO
  return scores[0]
}

/**
 * Return formatted data for the complete model with given region
 */
async function parseModelDir (modelPath, regionId, regionTruth) {
  let modelId = path.basename(modelPath)
  // Bootstrap cache
  if (!(modelId in CACHED_CSVS)) {
    CACHED_CSVS[modelId] = {}
  }

  let availableEpiweeks = utils.getWeekFiles(modelPath)
  let modelMeta = utils.getModelMeta(modelPath)

  let pointPredictions = []
  let binPredictions = []
  let scores = []

  for (let epiweek of fct.utils.epiweek.seasonEpiweeks(SEASON_ID)) {
    if (availableEpiweeks.indexOf(epiweek) === -1) {
      // Prediction not available for this week, return null
      pointPredictions.push(null)
      binPredictions.push(null)
    } else {
      let { pointData, binData, scoreData } = utils.parseCsv(
        getCsv(modelPath, epiweek), regionId, regionTruth
      )
      pointPredictions.push(pointData)
      binPredictions.push(binData)
      scores.push(scoreData)
    }
  }

  return {
    pointData: {
      id: modelId,
      meta: modelMeta,
      predictions: pointPredictions
    },
    distsData: {
      id: modelId,
      predictions: binPredictions
    },
    scoresData: {
      id: modelId,
      scores: aggregateScores(scores)
    }
  }
}

/**
 * Generate data files for the provided seasonData and using the
 * submission files in dataDir
 */
async function generateFiles(seasonData) {
  // Output to be written in file season-{season}.json
  let seasonOut = {
    seasonId: SEASON, // NOTE: This id is full xxxx-yyyy type id
    regions: []
  }

  // Output to be written in file scores-{season}.json
  let scoresOut = {
    seasonId: SEASON,
    regions: []
  }

  // Output to be written in file distributions/season-{season}-{region}.json
  let distsOut = []

  let regionPointData, regionDistsData, regionScoresData

  for (let regionId of fct.meta.regionIds) {
    let regionTruth = seasonData[regionId].map(({ epiweek, wili }) => { return { epiweek, wili } })
    regionPointData = []
    regionDistsData = []
    regionScoresData = []

    for (let model of MODELS_DIR) {
      let modelPath = path.join(DATA_DIR, SEASON, model)
      let { pointData, distsData, scoresData } = await parseModelDir(
        modelPath, regionId, regionTruth
      )
      regionPointData.push(pointData)
      regionDistsData.push(distsData)
      regionScoresData.push(scoresData)
    }

    seasonOut.regions.push({
      id: regionId,
      actual: parseRegionActual(seasonData, regionId),
      models: regionPointData,
      baseline: await fct.truth.getBaseline(regionId, SEASON_ID)
    })

    distsOut.push({
      seasonId: SEASON,
      regionId: regionId,
      models: regionDistsData
    })

    scoresOut.regions.push({
      id: regionId,
      models: regionScoresData
    })
  }

  await Promise.all([
    writeSeasonFile(seasonOut),
    writeScoresFile(scoresOut),
    ...distsOut.map(d => writeDistsFile(d, d.regionId))
  ])
  console.log(` Data files for season ${SEASON} written.`)
}
