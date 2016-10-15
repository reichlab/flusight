// Wrapper around delphi-epidata API (https://github.com/undefx/delphi-epidata)
// for getting actual flu data

const delphiAPI = require('./vendor/delphi_epidata')
const metadata = require('./metadata')

const regionIdentifiers = metadata.regions.map(x => x.id)

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
      output[id][season] = []
    })
  })

  // Request API
  delphiAPI.Epidata.fluview((res, message, data) => {
    data.forEach(d => {
      output[d['region']][weekToSeason(d['epiweek'])].push({
        week: d['epiweek'],
        data: d['wili']
      })
    })

    callback(output)
  },
                            regionIdentifiers,
                            [delphiAPI.Epidata.range(start, end)])
}

exports.getActual = getActual
