import * as types from './mutation-types'

export const updateSelectedSeason = ({ commit }, val) => {
  commit(types.UPDATE_SELECTED_SEASON, val)
}

export const updateSelectedRegion = ({ commit, getters }, val) => {
  // Trigger deselection
  if (getters.selectedRegion === val) commit(types.UPDATE_SELECTED_REGION, 0)
  else commit(types.UPDATE_SELECTED_REGION, val)
}

export const updateSelectedWeek = ({ commit }, val) => {
  commit(types.UPDATE_SELECTED_WEEK, val)
}

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
  getters.timeChart.update(getters.selectedWeekIdx)
}

/**
 * Tell choropleth to move to weekidx and highlight a region
 */
export const updateChoropleth = ({ getters }) => {
  let payload = {
    weekIdx: getters.selectedWeekIdx,
    regionIdx: getters.selectedRegion - 1
  }

  getters.choropleth.update(payload)
}

/**
 * Update week pointer in main store
 * and let watchers take care of everything else
 */
export const forward = ({ dispatch, getters }) => {
  dispatch('updateSelectedWeek', getters.nextWeek)
}

/**
 * Update week pointer in main store
 * and let watchers take care of everything else
 */
export const backward = ({ dispatch, getters }) => {
  dispatch('updateSelectedWeek', getters.previousWeek)
}

/**
 * Toggle display of legend control
 */
export const toggleLegend = ({ commit }) => {
  commit(types.TOGGLE_PANEL, 'legend')
}

/**
 * Toggle display of stats panel
 */
export const toggleStats = ({ commit }) => {
  commit(types.TOGGLE_PANEL, 'stats')
}

/**
 * Toggle relative display in choropleth
 */
export const toggleRelative = ({ commit }) => {
  commit(types.TOGGLE_CHOROPLETH_RELATIVE)
}
