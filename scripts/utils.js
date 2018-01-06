/**
 * Common utility functions
 */

const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const mmwr = require('mmwr-week')
const fct = require('flusight-csv-tools')

const readYaml = filePath => {
  return yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))
}

async function writeJSON (filePath, data) {
  return await fs.writeFile(filePath, JSON.stringify(data))
}

/**
 * Arange [a, b)
 */
const arange = (a, b) => [...Array(b - a).keys()].map(i => i + a)

/**
 * Return list of weekStamps in given mmwr season
 */
const seasonIdToWeekStamps = seasonId => {
  let maxWeek = (new mmwr.MMWRDate(seasonId, 30)).nWeeks
  return [
    ...arange(100 * seasonId + 30, 100 * seasonId + maxWeek + 1),
    ...arange(100 * (seasonId + 1) + 1, 100 * (seasonId + 1) + 30)
  ]
}

/**
 * Convert given weekstamp to index depending on the season
 */
const weekToIndex = (week, seasonWeekStamps) => {
  let seasonWeeks = seasonWeekStamps.map(st => st % 100)
  let wInt = Math.floor(week)
  if (wInt === 0) wInt = Math.max(...seasonWeeks)
  // TODO: Is this going to be right for 2014-2015?
  if (wInt === 53) wInt = 1
  return seasonWeeks.indexOf(wInt)
}

/**
 * Return all subdirectoies in given directory
 * @param {string} directory root directory
 * @returns {Array} list of subdirectory
 */
const getSubDirectories = directory => {
  return fs.readdirSync(directory).filter(file => {
    return fs.statSync(path.join(directory, file)).isDirectory()
  })
}

/**
 * Return all csv files (parsing to integer names) in directory
 * @param {string} directory root directory
 * @returns {Array} list of .csv files
 */
const getWeekFiles = directory => {
  let newFiles = fs.readdirSync(directory)
      .filter(f => f.endsWith('.csv'))
  return newFiles.map(file => parseInt(file.split()[0]))
}

/**
 * Get model metadata
 * @param {string} submissionDir path to the submission directory
 * @returns {Object} metadata object
 */
const getModelMeta = submissionDir => {
  let meta = {
    name: 'No metadata found',
    description: '',
    url: ''
  }

  let metaFiles = ['meta.yaml', 'meta.yml']

  for (let i = 0; i < metaFiles.length; i++) {
    try {
      let filePath = path.join(submissionDir, metaFiles[i])
      meta = readYaml(filePath)
    } catch (e) {
      continue
    }
  }

  return meta
}

/**
 * Filter data csv according to region
 * @param {Array} csv from fct
 * @param {string} region region identifier to filter on
 */
const regionFilterCsv = (csv, regionId, weekStamps) => {
  let filtered = {
    series: [null, null, null, null],
    peakTime: null,
    peakValue: null,
    onsetTime: null
  }

  function getTargetData (target, binBatch) {
    let cis = [90, 50]
    let point = csv.getPoint(target, regionId)
    let bins = csv.getBins(target, regionId)
    let ranges = cis.map(c => {
      return csv.getConfidenceRange(target, regionId, c)
    })

    return {
      point,
      low: ranges.map(r => r[0]),
      high: ranges.map(r => r[1]),
      bins: fct.utils.bins.sliceSumBins(bins, binBatch).map(b => b[2])
    }
  }

  [1, 2, 3, 4].map((t, idx) => {
    filtered.series[idx] = getTargetData(t, 5)
  })
  filtered.peakValue = getTargetData('peak', 5)
  filtered.peakTime = getTargetData('peak-wk', 1)
  filtered.onsetTime = getTargetData('onset-wk', 1)

  // Assuming all the predictions are not present when one wk isn't
  if (filtered.series[0].point > -1) {
    // Transform weeks predictions to season indices
    ['peakTime', 'onsetTime'].forEach(t => {
      filtered[t].point = weekToIndex(filtered[t].point, weekStamps)
      filtered[t].high = filtered[t].high.map(d => weekToIndex(d, weekStamps))
      filtered[t].low = filtered[t].low.map(d => weekToIndex(d, weekStamps))
    })
    return filtered
  } else {
    return null
  }
}

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

exports.readYaml = readYaml
exports.writeJSON = writeJSON
exports.arange = arange
exports.getSubDirectories = getSubDirectories
exports.regionFilterCsv = regionFilterCsv
exports.getWeekFiles = getWeekFiles
exports.getModelMeta = getModelMeta
exports.seasonIdToWeekStamps = seasonIdToWeekStamps
exports.weekToIndex = weekToIndex
exports.extractDistributions = extractDistributions
exports.deleteDistributions = deleteDistributions
