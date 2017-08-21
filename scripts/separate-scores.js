/**
 * Script for separating score data from the season data files
 */

const fs = require('fs')

// Take season id from command line
let inputJSON = process.argv[2]
let data = JSON.parse(fs.readFileSync(inputJSON, 'utf8'))

const getModelStats = seasonData => {
  return seasonData.regions.map(reg => {
    return {
      id: reg.id,
      scores: reg.models.map(mod => {
        return {
          id: mod.id,
          scores: mod.stats
        }
      })
    }
  })
}

process.stdout.write(JSON.stringify(getModelStats(data), null, ' '))
