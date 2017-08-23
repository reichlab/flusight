/**
 * Aux script for saving model scores in csv format
 */

const path = require('path')
const fs = require('fs')
const papa = require('papaparse')

// Paths
const outputFile = './scripts/assets/scores.csv'
const seasonDataDir = './src/assets/data/'

const getSeasonFiles = dir => {
  return fs.readdirSync(dir)
    .filter(item => item.startsWith('season-'))
    .map(item => path.join(dir, item))
}

const readSeasonFile = file => JSON.parse(fs.readFileSync(file), 'utf8')

const getModelStats = seasonData => {
  let data = []
  seasonData.regions.forEach(reg => {
    reg.models.forEach(mod => {
      // reg.id, seasonData.seasonId, mod.id
      for (let score in mod.stats) {
        if (mod.stats.hasOwnProperty(score)) {
          data.push([
            mod.id,
            seasonData.seasonId,
            reg.id,
            score,
            ...mod.stats[score].map(val => val || 'NA')
          ])
        }
      }
    })
  })
  return data
}

// Entry point
let csvHeader = ['model', 'season', 'region', 'score', 'oneWk', 'twoWk', 'threeWk', 'fourWk']
let csvData = [csvHeader]

getSeasonFiles(seasonDataDir).forEach(seasonFile => {
  let seasonData = getModelStats(readSeasonFile(seasonFile))
  csvData = csvData.concat(seasonData)
})

// Write the csv
fs.writeFile(outputFile, papa.unparse(csvData), err => {
  if (err) throw err
  console.log(` Scores written at ${outputFile}`)
})
