import * as utils from './utils'

// Selected items
export const metadata = state => state.metadata
export const selectedSeason = state => state.selected.season
export const selectedRegion = state => state.selected.region
export const selectedWeekIdx = state => state.selected.week.idx
export const selectedWeekName = state => {
  return state.selected.week.name ? state.selected.week.name : 'NA'
}
export const seasons = (state, getters) => {
  return state.data[getters.selectedRegion].seasons.map(s => s.id)
}
export const regions = state => state.data.map(d => d.subId)
export const models = (state, getters) => {
  return state.data[getters.selectedRegion]
    .seasons[getters.selectedSeason]
    .models.map(m => m.id)
}
export const timeChart = state => state.timeChart
export const choropleth = state => state.choropleth

// Toggles
export const choroplethRelative = state => state.toggles.choroplethRelative
export const legendShow = state => state.toggles.panels.legend
export const statsShow = state => state.toggles.panels.stats

export const nextWeek = (state, getters) => getters.timeChart.getNextWeekData()
export const previousWeek = (state, getters) => getters.timeChart.getPreviousWeekData()

export const choropleths = state => ['Actual Weighted ILI (%)', 'Relative Weighted ILI (%)']

/**
 * Return data subset for chart as specified in region/season selected
 */
export const timeChartData = (state, getters) => {
  let regionSubset = state.data[getters.selectedRegion]
  let currentSeasonId = getters.selectedSeason
  let seasonSubset = regionSubset.seasons[currentSeasonId]

  let selectedWeeksCount = seasonSubset.actual.length

  let historicalData = []

  // Add data from history store
  for (let season of Object.keys(regionSubset.history)) {
    historicalData.push({
      id: season,
      actual: utils.trimHistory(regionSubset.history[season], selectedWeeksCount)
    })
  }

  for (let i = 0; i < currentSeasonId; i++) {
    historicalData.push({
      id: regionSubset.seasons[i].id,
      actual: utils.trimHistory(utils.getMaxLagData(regionSubset.seasons[i].actual),
                                selectedWeeksCount)
    })
  }

  return {
    region: regionSubset.subId, // Submission ids are concise
    observed: seasonSubset.actual,
    actual: utils.getMaxLagData(seasonSubset.actual), // Using this to avoid confusion
    baseline: seasonSubset.baseline,
    models: seasonSubset.models, // All model predictions
    history: historicalData
  }
}

/**
 * Return actual data for all regions for current selections
 */
export const choroplethData = (state, getters) => {
  let output = utils.actualChoroplethData(state, getters)
  output.range = utils.choroplethDataRange(state, getters)
  return output
}

/**
 * Return stats related to models
 */
export const modelStats = (state, getters) => {
  let regionSubset = state.data[getters.selectedRegion]
  let seasonSubset = regionSubset.seasons[getters.selectedSeason]

  let actual = utils.getMaxLagData(seasonSubset.actual)
  let modelPreds = seasonSubset.models

  return {
    name: 'Mean Absolute Error',
    data: modelPreds.map(m => {
      return {
        id: m.id,
        value: utils.maeStats(m.predictions, actual)
      }
    })
  }
}
