/**
 * Provide actual flu data with lags
 * Use delphi-epidata API (https://github.com/cmu-delphi/delphi-epidata)
 */

const delphiAPI = require('../assets/delphi_epidata.min')
const region = require('./region')
const mmwr = require('mmwr-week')
const ProgressBar = require('progress')
// const fs = require('fs')

const regionIdentifiers = region.regionData.map(x => x.id)

/**
 * Function returning complete week array for a season
 * Consider mmwr week 30 as the season week number 1
 * @param {string} season representing season
 * @returns {array} container with week, data pairs
 */
const seasonWeeksData = season => {
  let first = parseInt(season.split('-')[0])
  let second = parseInt(season.split('-')[1])

  // Check the number of weeks in first year
  let firstYear = new mmwr.MMWRDate(first)
  let firstMaxWeek = firstYear.nWeeks

  let weeks = []
  // Weeks for first year
  for (let i = 30; i <= firstMaxWeek; i++) {
    weeks.push({
      week: parseInt(first + '' + i),
      data: []
    })
  }

  // Weeks for second year
  for (let i = 1; i < 30; i++) {
    let week

    if (i < 10) week = parseInt(second + '0' + i)
    else week = parseInt(second + '' + i)

    weeks.push({
      week: week,
      data: []
    })
  }
  return weeks
}

/**
 * Function mapping week number (201523) to season string
 * @param {number} week week number identifier
 * @returns {string} string season like 2014-2015
 */
const weekToSeason = week => {
  let weekNum = week % 100
  let year = parseInt(week / 100)
  if (weekNum > 29) {
    return [year, year + 1].join('-')
  } else {
    return [year - 1, year].join('-')
  }
}

const dateToStamp = date => date.year * 100 + date.week

/**
 * Get actual epidemic data for given seasons
 * @param {array} seasons array of string identifier strings
 * @param {function} callback callback function
 */
const getActual = (seasons, callback) => {
  // Get min max epiweek range in seasons
  let firstYear = Math.min(...seasons.map(d => parseInt(d.split('-')[0])))
  let lastYear = Math.max(...seasons.map(d => parseInt(d.split('-')[1])))

  // Start week
  let startStamp = firstYear * 100 + 30
  // let startDate = stampToDate(startStamp)

  // Current week
  let currentDate = new mmwr.MMWRDate()
  currentDate.fromMomentDate()
  let currentStamp = dateToStamp(currentDate)

  // Last week
  let endStamp = Math.min(currentStamp, lastYear * 100 + 29)
  // let endDate = stampToDate(endStamp)

  // Setup container
  let output = {}
  regionIdentifiers.forEach(id => {
    output[id] = {}
    seasons.map(season => {
      output[id][season] = seasonWeeksData(season)
    })
  })

  let progressBar = new ProgressBar(' :bar :current of :total lag values', {
    complete: '▇',
    incomplete: '-',
    total: 52
  })

  // Fetch data from delphi api for given lag
  const laggedRequest = lag => {
    const populateOutput = data => {
      data.forEach(d => {
        let sub = output[d.region][weekToSeason(d.epiweek)]
        let dataIndex
        for (let i = 0; i < sub.length; i++) {
          if (sub[i].week === d.epiweek) {
            dataIndex = i
            break
          }
        }

        output[d.region][weekToSeason(d.epiweek)][dataIndex].data.push({
          lag: lag,
          value: d.wili
        })
      })
    }

    const nextLagCall = (currentLag) => {
      progressBar.tick()
      if (currentLag === 0) {
        callback(output)
      } else {
        laggedRequest(currentLag - 1)
      }
    }

    delphiAPI.Epidata.fluview((res, message, data) => {
      if (data !== undefined) {
        populateOutput(data)
      }

      nextLagCall(lag)
    }, regionIdentifiers, [delphiAPI.Epidata.range(startStamp, endStamp)], null, lag)
  }

  // Look upto 51 weeks back
  laggedRequest(51)
}

exports.getActual = getActual
