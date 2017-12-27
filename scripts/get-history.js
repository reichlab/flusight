/**
 * Download and save historical data
 */

const fct = require('flusight-csv-tools')
const fs = require('fs-extra')

const historyFile = './scripts/assets/history.json'

// Download history for seasons 2003 to 2014
let seasonIds = [...Array(12).keys()].map(i => 2003 + i)

console.log(` Downloading historical data for the following seasons\n${seasonIds.join(', ')}`)

/**
 * Convert data returned from fct to the structure used by flusight
 * TODO Make the fct structure standard
 */
function parseHistoryData (seasonData) {
  let output = {}
  fct.meta.regionIds.forEach(rid => {
    output[rid] = seasonIds.map((sid, idx) => {
      return {
        season: `${sid}-${sid + 1}`,
        data: seasonData[idx][rid].map(({ epiweek, wili }) => {
          return {
            week: epiweek,
            data: wili
          }
        })
      }
    })
  })
  return output
}

fct.truth.getSeasonsDataLatestLag(seasonIds).then(d => {
  fs.writeFileSync(historyFile, JSON.stringify(parseHistoryData(d), null, 2))
  console.log(` Output written at ${historyFile}`)
}).catch(e => {
  console.log(e)
  process.exit(1)
})
