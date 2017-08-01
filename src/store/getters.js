import * as utils from './utils'

export const branding = state => state.branding
export const metadata = state => state.metadata
export const history = state => state.history
export const updateTime = state => {
  return state.metadata ? state.metadata.updateTime : 'NA'
}

export const seasons = (state, getters) => {
  if (state.data) {
    return state.data[getters['switches/selectedRegion']].seasons.map(s => s.id)
  } else {
    return ['']
  }
}
export const regions = state => {
  if (state.data) {
    return state.data.map(d => d.subId)
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
  let regionSubset = state.data[getters['switches/selectedRegion']]
  return regionSubset.seasons[getters['switches/selectedSeason']].actual.map(d => d.data)
}

/**
 * Return a series of time points to be referenced by all series
 */
export const timePoints = (state, getters) => {
  if (state.data) {
    let regionSubset = state.data[getters['switches/selectedRegion']]
    let seasonSubset = regionSubset.seasons[getters['switches/selectedSeason']]

    return seasonSubset.actual.map(d => {
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
  let regionSubset = state.data[getters['switches/selectedRegion']]
  let seasonSubset = regionSubset.seasons[getters['switches/selectedSeason']]

  // Return just the values
  return utils.getMaxLagData(seasonSubset.actual).map(d => d.data)
}

/**
 * Return historical data for selected state
 * All data older than currently selected season
 */
export const historicalData = (state, getters) => {
  let regionSubset = state.data[getters['switches/selectedRegion']]
  let currentSeasonId = getters['switches/selectedSeason']
  let weeksCount = regionSubset.seasons[currentSeasonId].actual.length

  let output = []

  // Add data from history store
  getters.history[regionSubset.id].forEach(h => {
    output.push({
      id: h.season,
      actual: utils.trimHistory(h.data, weeksCount)
    })
  })

  for (let i = 0; i < currentSeasonId; i++) {
    output.push({
      id: regionSubset.seasons[i].id,
      actual: utils.trimHistory(utils.getMaxLagData(regionSubset.seasons[i].actual),
                                weeksCount)
    })
  }

  return output
}

/**
 * Baseline for selected state
 */
export const baseline = (state, getters) => {
  let regionSubset = state.data[getters['switches/selectedRegion']]
  return regionSubset.seasons[getters['switches/selectedSeason']].baseline
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
  let seasonId = getters['switches/selectedSeason']
  let relative = getters['switches/choroplethRelative']

  let output = {
    data: [],
    type: relative ? 'diverging' : 'sequential',
    decorator: relative ? x => x + ' % (baseline)' : x => x + ' %'
  }

  state.data.map(r => {
    let values = utils.getMaxLagData(r.seasons[seasonId].actual)

    if (relative) values = utils.baselineScale(values, r.seasons[seasonId].baseline)

    output.data.push({
      region: r.subId,
      states: r.states,
      value: values
    })
  })

  output.data = output.data.slice(1) // Remove national data

  output.range = utils.choroplethDataRange(state, getters)
  return output
}
