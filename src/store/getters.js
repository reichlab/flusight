import * as utils from './utils'

export const branding = state => state.branding
export const metadata = state => state.metadata
export const history = state => state.history
export const seasonDataUrls = state => state.seasonDataUrls
export const updateTime = state => {
  return state.metadata ? state.metadata.updateTime : 'NA'
}

/**
 * Return seasons for which we have downloaded the data
 */
export const downloadedSeasons = state => {
  return state.data.map(d => d.seasonId)
}

/**
 * Return subset of data reflecting current selection
 * Assume that we have already downloaded the data needed
 */
export const selectedData = (state, getters) => {
  let selectedSeasonIdx = getters['switches/selectedSeason']
  let selectedRegionIdx = getters['switches/selectedRegion']

  let selectedSeasonId = getters.seasons[selectedSeasonIdx]
  let seasonSubset = state.data[getters.downloadedSeasons.indexOf(selectedSeasonId)]

  return seasonSubset.regions[selectedRegionIdx]
}

/**
 * Return list of seasons available for us
 */
export const seasons = (state, getters) => {
  if (state.metadata) {
    return state.metadata.seasonIds
  } else {
    return ['']
  }
}

export const regions = (state, getters) => {
  if (state.metadata) {
    return state.metadata.regionData.map(r => r.subId)
  } else {
    return ['']
  }
}

export const choropleths = state => ['Actual Weighted ILI (%)', 'Relative Weighted ILI (%)']

export const timeChart = state => state.timeChart
export const choropleth = state => state.choropleth
export const distributionChart = state => state.distributionChart

/**
 * Return observed data for currently selected state
 */
export const observed = (state, getters) => {
  return getters.selectedData.actual.map(d => d.data)
}

/**
 * Return a series of time points to be referenced by all series
 */
export const timePoints = (state, getters) => {
  if (state.data.length > 0) {
    return getters.selectedData.actual.map(d => {
      return {
        week: d.week % 100,
        year: Math.floor(d.week / 100)
      }
    })
  } else {
    return [{
      week: 0,
      year: 0
    }]
  }
}

/**
 * Return actual data for currently selected state
 */
export const actual = (state, getters) => {
  return utils.getMaxLagData(getters.selectedData.actual).map(d => d.data)
}

/**
 * Return historical data for selected state
 * All data older than currently selected season
 */
export const historicalData = (state, getters) => {
  let selectedRegionIdx = getters['switches/selectedRegion']
  let selectedRegionId = getters.metadata.regionData[selectedRegionIdx].id
  let selectedSeasonIdx = getters['switches/selectedSeason']
  let weeksCount = getters.selectedData.actual.length

  let output = []

  // Add data from history store
  getters.history[selectedRegionId].forEach(h => {
    output.push({
      id: h.season,
      actual: utils.trimHistory(h.data, weeksCount)
    })
  })

  // NOTE: Skipping season not yet downloaded
  for (let i = 0; i < selectedSeasonIdx; i++) {
    let downloadedSeasonIdx = getters.downloadedSeasons.indexOf(getters.seasons[i])
    if (downloadedSeasonIdx !== -1) {
      output.push({
        id: getters.seasons[i],
        actual: utils.trimHistory(
          utils.getMaxLagData(state.data[downloadedSeasonIdx].regions[selectedRegionIdx].actual),
          weeksCount
        )
      })
    }
  }

  return output
}

/**
 * Baseline for selected state
 */
export const baseline = (state, getters) => {
  return getters.selectedData.baseline
}

/**
 * Return data subset for chart as specified in region/season selected
 */
export const timeChartData = (state, getters) => {
  return {
    timePoints: getters.timePoints,
    observed: getters.observed,
    actual: getters.actual,
    baseline: getters.baseline,
    models: getters['models/models'],
    history: getters.historicalData
  }
}

/**
 * Return data for distribution plot
 */
export const distributionChartData = (state, getters) => {
  return {
    timePoints: getters.timePoints,
    currentIdx: getters['weeks/selectedWeekIdx'],
    models: getters['models/modelDistributions']
  }
}

/**
 * Return actual data for all regions for current selections
 */
export const choroplethData = (state, getters) => {
  let selectedSeasonIdx = getters['switches/selectedSeason']
  let relative = getters['switches/choroplethRelative']

  let output = {
    data: [],
    type: relative ? 'diverging' : 'sequential',
    decorator: relative ? x => x + ' % (baseline)' : x => x + ' %'
  }

  let downloadedSeasonIdx = getters.downloadedSeasons.indexOf(getters.seasons[selectedSeasonIdx])

  state.data[downloadedSeasonIdx].regions.map((reg, regIdx) => {
    let values = utils.getMaxLagData(reg.actual)

    if (relative) values = utils.baselineScale(values, reg.baseline)

    output.data.push({
      region: getters.metadata.regionData[regIdx].subId,
      states: getters.metadata.regionData[regIdx].states,
      value: values
    })
  })

  output.data = output.data.slice(1) // Remove national data

  output.range = utils.choroplethDataRange(state.data, relative)
  return output
}
