// Generate json data for visualization

const actual = require('./modules/actual')
const metadata = require('./modules/metadata')
const transform = require('./modules/transform')
const preprocess = require('./modules/preprocess')
const baseline = require('./modules/baseline')
const config = require('./modules/config')
const utils = require('./modules/utils')

const fs = require('fs')
const path = require('path')
const moment = require('moment')


/**
 * Generate json data using submissions files in the given dir
 * @param {string} dataDirectory directory with data files
 * @param {string} configFile config.yaml file
 * @param {string} baselineFile wILI_Baseline.csv file
 * @param {string} outputFile final data.json file
 */
const generate = (dataDirectory, configFile, baselineFile, outputFile) => {

  // Look for seasons
  let seasons = utils.getSubDirectories(dataDirectory)

  // Stop if no folder found
  if (seasons.length == 0) {
    console.log('No seasons found in data directory!')
    return
  }

  // Print seasons
  console.log('Found ' + seasons.length + ' seasons:')
  seasons.map(s => console.log(s))
  console.log('')

  // Bootstrap output
  let output = metadata.regions

  // Get baseline data
  let baselineData = baseline.getBaselines(baselineFile)

  console.log('Gathering actual data for the seasons...')

  // Get actual data for seasons
  actual.getActual(seasons, (actualData) => {
    // Caches CSVs
    let cachedCSVDumps = []

    // Add seasons to output
    output.forEach((val, idx) => {
      console.log('Parsing region: ' + val.region)
      val.seasons = seasons.map(season => {
        // Get models for each season
        let modelsDir = utils.getSubDirectories(path.join(dataDirectory, season))
        let models = modelsDir.map(model => {
          // Get prediction weeks for each model
          let weeks = utils.getWeekFiles(path.join(dataDirectory, season, model))
          return {
            id: model,
            predictions: weeks.map(week => {
              let fileName = path.join(dataDirectory, season, model, week + '.csv'),
                  data = null,
                  filtered = null
              // Take from cache to avoid file reads
              // TODO: change this quirkiness someday
              if (cachedCSVDumps.indexOf(fileName) > -1) {
                data = cachedCSVDumps[fileName]
              } else {
                data = transform.longToJson(fs.readFileSync(fileName, 'utf8'))
                cachedCSVDumps[fileName] = data
              }
              // Take only for the current region
              filtered = utils.regionFilter(data, val.subId)
              if (filtered == -1) return -1
              else {
                filtered.week = week
                return filtered
              }
            }).filter(skipData => skipData !== -1)
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

    let yamlData = config.read(configFile)
    // Add current time
    yamlData.updateTime = moment.utc(new Date()).format('MMMM Do YYYY, hh:mm:ss')
    let outputWithYamlData = {
      data: output,
      metadata: yamlData
    }

    fs.writeFile(outputFile, JSON.stringify(outputWithYamlData, null, 2), (err) => {
      if (err) {
        return console.log(err)
      }

      console.log('\nAll done! JSON saved at ' + outputFile)
    })
  })
}

/**
 * Combine all preprocessing steps
 * @param {string} dataDirectory root data directory
 * @param {function} callback function to chain
 */
const process = (dataDirectory, callback) => {
  preprocess.processWide(dataDirectory, callback)
}

exports.process = process
exports.generate = generate
