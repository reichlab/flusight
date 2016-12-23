import * as types from './mutation-types'

// Initializations
// ---------------
export const initTimeChart = ({ commit }, val) => {
  commit(types.SET_TIMECHART, val)
}

export const initChoropleth = ({ commit }, val) => {
  commit(types.SET_CHOROPLETH, val)
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

/**
 * Update week pointer in main store
 * and let watchers take care of everything else
 */
export const forward = ({ dispatch, getters }) => {
  dispatch('weeks/updateSelectedWeek', getters.nextWeek)
}

/**
 * Update week pointer in main store
 * and let watchers take care of everything else
 */
export const backward = ({ dispatch, getters }) => {
  dispatch('weeks/updateSelectedWeek', getters.previousWeek)
}
