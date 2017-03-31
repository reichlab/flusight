import * as types from './mutation-types'

// Initializations
// ---------------
export const initTimeChart = ({ commit }, val) => {
  commit(types.SET_TIMECHART, val)
}

export const initChoropleth = ({ commit }, val) => {
  commit(types.SET_CHOROPLETH, val)
}

export const initDistributionChart = ({ commit }, val) => {
  commit(types.SET_DISTRIBUTIONCHART, val)
}

// Plotting (data-changing) actions
// --------------------------------

/**
 * Plot (update) time chart with region / season data
 */
export const plotTimeChart = ({ getters }) => {
  getters.timeChart.plot(getters.timeChartData)
}

/**
 * Plot distribution chart
 */
export const plotDistributionChart = ({ getters }) => {
  getters.distributionChart.plot(getters.distributionChartData)
}

/**
 * Plot (update) choropleth with currently selected data
 */
export const plotChoropleth = ({ commit, dispatch, getters }) => {
  getters.choropleth.plot(getters.choroplethData)
  dispatch('updateChoropleth')
}

/**
 * Tell time chart to move markers to weekIdx
 */
export const updateTimeChart = ({ getters }) => {
  getters.timeChart.update(getters['weeks/selectedWeekIdx'])
}

/**
 * Tell choropleth to move to weekidx and highlight a region
 */
export const updateChoropleth = ({ getters }) => {
  let payload = {
    weekIdx: getters['weeks/selectedWeekIdx'],
    regionIdx: getters['switches/selectedRegion'] - 1
  }

  getters.choropleth.update(payload)
}
