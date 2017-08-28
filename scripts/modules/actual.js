/**
 * Provide actual flu data with lags
 * Use delphi-epidata API (https://github.com/cmu-delphi/delphi-epidata)
 */

const delphiAPI = require('../assets/delphi_epidata.min')
const region = require('./region')
const mmwr = require('mmwr-week')
const ProgressBar = require('progress')

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
      actual: -1,
      lagData: []
    })
  }

  // Weeks for second year
  for (let i = 1; i < 30; i++) {
    let week

    if (i < 10) week = parseInt(second + '0' + i)
    else week = parseInt(second + '' + i)

    weeks.push({
      week: week,
      actual: -1,
      lagData: []
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
 * @param {array} season season identifier string
 * @param {function} callback callback function
 */
const getActual = (season, callback) => {
  // Get min max epiweek range in seasons
  let [firstYear, lastYear] = season.split('-').map(d => parseInt(d))

  // Go upto this lag value back
  let maxLag = 51

  // Start week
  let startStamp = firstYear * 100 + 30

  // Current week
  let currentDate = new mmwr.MMWRDate()
  currentDate.fromMomentDate()
  let currentStamp = dateToStamp(currentDate)

  // Last week
  let endStamp = Math.min(currentStamp, lastYear * 100 + 29)

  // Setup container
  // Request fill in this
  let output = {}
  regionIdentifiers.forEach(id => {
    output[id] = {
      [season]: seasonWeeksData(season)
    }
  })

  let progressBar = new ProgressBar(' :bar :current of :total lag values', {
    complete: '▇',
    incomplete: '-',
    total: maxLag + 1
  })

  // Find the index for filling in output
  const getDataIndex = apiDataPoint => {
    let seasonId = weekToSeason(apiDataPoint.epiweek)
    let sub = output[apiDataPoint.region][seasonId]
    return sub.map(s => s.week).indexOf(apiDataPoint.epiweek)
  }

  // Fetch actual data provided at whatever lag value (might be larger than 51)
  const actualRequest = (cbActual) => {
    delphiAPI.Epidata.fluview((res, message, data) => {
      if (data !== undefined) {
        data.forEach(d => {
          let dataIndex = getDataIndex(d)
          output[d.region][weekToSeason(d.epiweek)][dataIndex].actual = d.wili
        })
      }
    }, regionIdentifiers, [delphiAPI.Epidata.range(startStamp, endStamp)])
    cbActual()
  }

  // Fetch data from delphi api for given lag
  const laggedRequest = (lag, cbLag) => {
    const nextLagCall = (currentLag) => {
      progressBar.tick()
      if (currentLag === 0) {
        // Lag requests done
        cbLag()
      } else {
        laggedRequest(currentLag - 1, cbLag)
      }
    }

    delphiAPI.Epidata.fluview((res, message, data) => {
      if (data !== undefined) {
        data.forEach(d => {
          let dataIndex = getDataIndex(d)
          output[d.region][weekToSeason(d.epiweek)][dataIndex].lagData.push({
            lag: lag,
            value: d.wili
          })
        })
      }

      nextLagCall(lag)
    }, regionIdentifiers, [delphiAPI.Epidata.range(startStamp, endStamp)], null, lag)
  }

  // Look upto maxLag weeks back
  laggedRequest(maxLag, () => {
    // Fill in actual values now
    actualRequest(() => {
      // Return the populated container
      callback(output)
    })
  })
}

exports.getActual = getActual
