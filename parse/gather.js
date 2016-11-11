// One time data collection tasks

const delphiAPI = require('./modules/assets/delphi_epidata')
const metadata = require('./modules/metadata')
const fs = require('fs')
const download = require('download')

const regionIdentifiers = metadata.regions.map(r => r.id)

/**
 * Download and save baseline data file
 */
const saveBaseline = (fileName) => {
  let baselineUrl = 'https://raw.githubusercontent.com/cdcepi/FluSight-forecasts/master/wILI_Baseline.csv'
  download(baselineUrl).pipe(fs.createWriteStream(fileName))
}

/**
 * Function mapping week number (201523) to season string
 * @param {number} week week number identifier
 * @returns {string} string season like 2014-2015
 */
const weekToSeason = (week) => {
  let weekNum = week % 100,
      year = parseInt(week / 100)
  if (weekNum > 29) {
    return [year, year + 1].join('-')
  } else {
    return [year - 1, year].join('-')
  }
}

/**
 * Return a list of seasons for given range
 */
const getSeasons = (start, end) => {
  let seasons = []

  for (let w = start; w < end; w += 100) {
    seasons.push(weekToSeason(w))
  }

  return seasons
}

/**
 * Function to request delphi API for a given range
 */
const requestAPI = (range, container, callback) => {
  // Request API
  delphiAPI.Epidata.fluview((res, message, data) => {
    data.forEach(d => {
      let formatted = {
        week: d['epiweek'],
        data: d['wili']
      }
      container[d['region']][weekToSeason(d['epiweek'])].push(formatted)
    })

    callback()
  },
                            regionIdentifiers,
                            [delphiAPI.Epidata.range(range[0], range[1])])
}

/**
 * Download and save historical data
 */
const saveHistory = (fileName) => {

  // History range
  let start = 200330,
      end = 201529,
      breakPoint = 200929 // API allows a max of 3650 results per request

  let seasons = getSeasons(start, end)

  // Setup container
  let historyData = {}
  regionIdentifiers.forEach(id => {
    historyData[id] = {}
    seasons.map(season => {
      historyData[id][season] = []
    })
  })

  requestAPI([start, breakPoint], historyData, () => {
    requestAPI([breakPoint + 1, end], historyData, () => {
      fs.writeFile(fileName, JSON.stringify(historyData, null, 2), (err) => {
        if (err) {
          return console.log(err)
        }
      })
    })
  })
}

exports.saveBaseline = saveBaseline
exports.saveHistory = saveHistory
