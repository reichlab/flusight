// Generate json data for visualization

const delphiWrapper = require('./delphiWrapper')
const meta = require('./meta')
const old2new = require('./old2new')
const new2json = require('./new2json')
const fs = require('fs')
const path = require('path')
const util = require('util')


// Return all subdirectoies in given directory
const getSubDirectories = (directory) => {
  return fs.readdirSync(directory).filter(file => {
    return fs.statSync(path.join(directory, file)).isDirectory()
  })
}

// Return all files (parsing to integer names)
const getIntFiles = (directory) => {
  return fs.readdirSync(directory).map(file => parseInt(file.split()[0]))
}

// Filter data returned from new2json according to region
const filterCache = (data, region) => {
  let filtered = {}

  let keyOrder = [
    'onsetWeek',
    'peakWeek',
    'peakPercent',
    'oneWk',
    'twoWk',
    'threeWk',
    'fourWk'
  ]

  data.filter(d => d.region == region).forEach((d, idx) => {
    filtered[keyOrder[idx]] = {
      point: d.point,
      low: d.low,
      high: d.high
    }
  })

  return filtered
}

// Generate json data using submissions files in the given dir
const generate = (directory, outputFile, spinner) => {

  // Look for seasons
  let seasons = getSubDirectories(directory)

  // Ignore 'old' directory
  let oldIndex = seasons.indexOf('old')
  if (oldIndex > -1) seasons.splice(oldIndex, 1)

  // Bootstrap output
  let output = meta.regions

  // Caches csvs
  let cachedCSVDumps = []

  // Add seasons to output
  if (seasons.length == 0) {
    console.log('No seasons found !')
    process.exit(1)
  } else {
    output.forEach((val, idx) => {
      val.seasons = seasons.map(s => {
        // Get models for each season
        let modelsDir = getSubDirectories(path.join(directory, s))
        let models = modelsDir.map(m => {
          // Get prediction weeks for each model
          let weeks = getIntFiles(path.join(directory, s, m))
          return {
            id: m,
            predictions: weeks.map(w => {
              let fileName = path.join(directory, s, m, w + '.csv'),
                  data = null,
                  filtered = null
              // Take data
              if (cachedCSVDumps.indexOf(fileName) > -1) {
                data = cachedCSVDumps[fileName]
              } else {
                data = new2json.transform(fs.readFileSync(fileName, 'utf8'))
                cachedCSVDumps[fileName] = data
              }
              // Take only for the current region
              filtered = filterCache(data, val.subId)
              filtered.week = w
              return filtered
            })
          }
        })
        return {
          id: s,
          actual: [], // get these values
          models: models
        }
      })
    })
  }

  fs.writeFile(outputFile, JSON.stringify(output, null, 2), (err) => {
    if (err) {
      return console.log(err)
    }

    spinner.stop()
  })
}

exports.generate = generate
