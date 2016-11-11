// Wrapper around delphi-epidata API (https://github.com/undefx/delphi-epidata)
// for getting actual flu data

const delphiAPI = require('./assets/delphi_epidata')
const metadata = require('./metadata')
const moment = require('moment')

const regionIdentifiers = metadata.regions.map(x => x.id)

/**
 * Function returning complete week array for a season
 * @param {string} season representing season
 * @returns {array} container with week, data pairs
 */
const seasonWeeksData = (season) => {
  let first = parseInt(season.split('-')[0]),
      second = parseInt(season.split('-')[1])

  // Check the number of weeks in first year
  let firstMaxWeek = Math.max(moment(new Date(first, 11, 31)).week(),
                              moment(new Date(first, 11, 24)).week())

  let weeks = []
  // Weeks for first year
  for (let i = 30; i <= firstMaxWeek; i++) {
    weeks.push({
      week: parseInt(first + '' + i),
      data: -1
    })
  }

  // Weeks for second year
  for (let i = 1; i < 30; i++) {
    let week

    if (i < 10) week = parseInt(second + '0' + i)
    else week = parseInt(second + '' + i)

    weeks.push({
      week: week,
      data: -1
    })
  }
  return weeks
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
 * Get actual epidemic data for given seasons
 * @param {array} seasons array of string identifier strings
 * @param {function} callback callback function
 */
const getActual = (seasons, callback) => {

  // Get min max epiweek range in seasons
  let firstYear = Math.min(...seasons.map(d => parseInt(d.split('-')[0]))),
      lastYear = Math.max(...seasons.map(d => parseInt(d.split('-')[1])))

  // Request range
  let start = parseInt(firstYear + '' + 30),
      end = parseInt(lastYear + '' + 29)

  // Setup container
  let output = {}
  regionIdentifiers.forEach(id => {
    output[id] = {}
    seasons.map(season => {
      output[id][season] = seasonWeeksData(season)
    })
  })

  // Request API
  delphiAPI.Epidata.fluview((res, message, data) => {
    data.forEach(d => {
      let sub = output[d['region']][weekToSeason(d['epiweek'])]
      let dataIndex
      for (let i = 0; i < sub.length; i++) {
        if (sub[i].week == d['epiweek']) {
          dataIndex = i
          break
        }
      }
      output[d['region']][weekToSeason(d['epiweek'])][dataIndex].data = d['wili']
    })

    callback(output)
  },
                            regionIdentifiers,
                            [delphiAPI.Epidata.range(start, end)])
}

exports.getActual = getActual
