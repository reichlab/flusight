/**
 * Download and save historical data
 */

const delphiAPI = require('./assets/delphi_epidata.min')
const region = require('./modules/region')
const fs = require('fs')

const regionIdentifiers = region.regionData.map(r => r.id)
const historyFile = './scripts/assets/history.json'

/**
 * Function mapping week number (201523) to season string
 * @param {number} week week number identifier
 * @returns {string} string season like 2014-2015
 */
const weekToSeason = (week) => {
  let weekNum = week % 100
  let year = parseInt(week / 100)
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
      let season = weekToSeason(d['epiweek'])
      let seasonIndex = container[d['region']].map(d => d.season).indexOf(season)
      container[d['region']][seasonIndex].data.push(formatted)
    })

    callback()
  }, regionIdentifiers, [delphiAPI.Epidata.range(range[0], range[1])])
}

// Download history
// from 200330 ro 201529
let start = 200330
let end = 201529
let breakPoint = 200929 // API allows a max of 3650 results per request

let seasons = getSeasons(start, end)

// Setup container
let historyData = {}
regionIdentifiers.forEach(id => {
  historyData[id] = []
  seasons.map(season => {
    historyData[id].push({
      season: season,
      data: []
    })
  })
})

console.log(' Downloading historical data from ' + start + ' to ' + end)

requestAPI([start, breakPoint], historyData, () => {
  requestAPI([breakPoint + 1, end], historyData, () => {
    fs.writeFile(historyFile, JSON.stringify(historyData, null, 2), err => {
      if (err) return console.log(err)
      else return null
    })
  })
})
