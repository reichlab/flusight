/**
 * Script to parse and write data for a single season
 * This is supposed to be called in child processes via the main parse script
 */

const fs = require('fs-extra')
const path = require('path')
const utils = require('./utils')
const fct = require('flusight-csv-tools')
const moize = require('moize')

// Directory with CSVs
const DATA_DIR = './data'

// Directory for output JSONs
const OUT_DIR = './src/assets/data'

// Look for seasons in the data directory
const SEASONS = utils.getSubDirectories(DATA_DIR)

// Take input season from command line argument
const SEASON_ID = parseInt(process.argv[2])
const SEASON = `${SEASON_ID}-${SEASON_ID + 1}`
const MODELS_DIR = utils.getSubDirectories(path.join(DATA_DIR, SEASON))

/**
 * Return season name for writing files
 */
function getSeasonName () {
  if (SEASONS.indexOf(SEASON) === SEASONS.length - 1) {
    return 'latest'
  } else {
    return SEASON
  }
}

async function writeSeasonFile (data) {
  await utils.writeJSON(path.join(OUT_DIR, `season-${getSeasonName()}.json`), data)
}

async function writeScoresFile (data) {
  await utils.writeJSON(path.join(OUT_DIR, `scores-${getSeasonName()}.json`), data)
}

async function writeDistsFile (data, regionId) {
  let distsDir = path.join(OUT_DIR, 'distributions')
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
function parseRegionActual (seasonData, regionId) {
  let regionSubset = seasonData[regionId]

  let epiweeks = fct.utils.epiweek.seasonEpiweeks(SEASON_ID)
  return epiweeks.map(ew => {
    let ewData = regionSubset.find(({ epiweek }) => epiweek === ew)
    // Rename keys to match the expectations of flusight
    // and extend by filling in missing epiweeks
    if (ewData) {
      return {
        week: ewData.epiweek,
        actual: ewData.wili,
        lagData: ewData.lagData.map(({ lag, wili }) => { return { lag, value: wili } })
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
const getCsv = moize(function (modelPath, epiweek) {
  let modelId = path.basename(modelPath)
  console.log(path.join(modelPath, epiweek + '.csv'))
  return new fct.Csv(path.join(modelPath, epiweek + '.csv'), epiweek, modelId)
})

/**
 * Return csv score using cache
 */
const getCsvScore = moize(async function (csv) {
  return await fct.score.score(csv)
}, { isPromise: true })

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
      point = seasonEpiweeks.indexOf(point)
      high = high.map(d => seasonEpiweeks.indexOf(d))
      low = low.map(d => seasonEpiweeks.indexOf(d))
    }

    return { point, low, high }
  }

  return {
    series: ['1-ahead', '2-ahead', '3-ahead', '4-ahead'].map(getTargetData),
    peakValue: getTargetData('peak'),
    peakTime: getTargetData('peak-wk'),
    onsetTime: getTargetData('onset-wk')
  }
}

/**
 * Return bin data for the given region using the csv object
 */
function parseBinData (csv, regionId) {
  function getTargetData (target) {
    let bins = csv.getBins(target, regionId)

    // There are different types of bins that we need to consider
    if (bins.length === 131) {
      // These are regular, new style, wili bins with last one being
      // [13, 100] which we skip
      return { bins: fct.utils.bins.sliceSumBins(bins.slice(0, -1), 5).map(b => b[2]) }
    } else if (bins.length === 27) {
      // These are old style wili bins with last one being [13, 100] which
      // we skip
      return { bins: bins.slice(0, -1).map(b => b[2]) }
    } else if (target === 'peak-wk') {
      return { bins: bins.map(b => b[2]) }
    } else if (target === 'onset-wk') {
      // We skip the none bin
      return { bins: bins.slice(0, -1).map(b => b[2]) }
    } else {
      throw new Error(`Unknown bin size ${bins.length} in parseBinData for ${target}, ${regionId}`)
    }
  }

  return {
    series: ['1-ahead', '2-ahead', '3-ahead', '4-ahead'].map(getTargetData),
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
async function parseCsv (csv, regionId) {
  return {
    pointData: parsePointData(csv, regionId),
    binData: parseBinData(csv, regionId),
    scoreData: (await getCsvScore(csv))[regionId]
  }
}

/**
 * Return formatted data for the complete model with given region
 */
async function parseModelDir (modelPath, regionId) {
  let modelId = path.basename(modelPath)
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
      let { pointData, binData, scoreData } = await parseCsv(getCsv(modelPath, epiweek), regionId)
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
      scores: utils.aggregateScores(scores)
    }
  }
}

/**
 * Generate data files for the provided seasonData and using the
 * submission files in dataDir
 */
async function generateFiles (seasonData) {
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
    regionPointData = []
    regionDistsData = []
    regionScoresData = []

    for (let model of MODELS_DIR) {
      let modelPath = path.join(DATA_DIR, SEASON, model)
      let { pointData, distsData, scoresData } = await parseModelDir(modelPath, regionId)
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

// Entry point
fct.truth.getSeasonDataAllLags(SEASON_ID)
  .then(sd => generateFiles(sd))
  .then(() => { console.log('All done') })
  .catch(e => {
    console.log(e)
    process.exit(1)
  })
