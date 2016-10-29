import * as get from './getters'

// Vuex actions

export const updateSelectedSeason = ({ dispatch, state }, val) => {
  dispatch('UPDATE_SELECTED_SEASON', val)
}

export const updateSelectedRegion = ({ dispatch, state }, val) => {
  dispatch('UPDATE_SELECTED_REGION', val)
}

export const updateSelectedWeek = ({ dispatch, state }, val) => {
  dispatch('UPDATE_SELECTED_WEEK', val)
}

export const updateSelectedChoropleth = ({ dispatch, state}, val) => {
  dispatch('UPDATE_SELECTED_CHOROPLETH', val)
}

// Initializations
// ---------------

export const initTimeChart = ({ dispatch, state }, val) => {
  dispatch('SET_TIMECHART', val)
}

export const initChoropleth = ({ dispatch, state }, val) => {
  dispatch('SET_CHOROPLETH', val)
}

// Plotting (data-changing) actions
// --------------------------------

/**
 * Plot (update) time chart with region / season data
 */
export const plotTimeChart = ({ dispatch, state }) => {
}

/**
 * Plot (update) choropleth with currently selected data
 */
export const plotChoropleth = ({ dispatch, state }) => {
}

// Movement transition actions
export const updateTimeChart = ({ dispatch, state }) => {
}

export const updateChoropleth = ({ dispatch, state }) => {
}

// Update week pointer in store
// watchers will take care of everything else
export const forward = ({ dispatch, state }) => {
  updateSelectedWeek({ dispatch, state }, get.nextWeek(state))
}

// Update week pointer in store
// watchers will take care of everything else
export const backward = ({ dispatch, state }) => {
  updateSelectedWeek({ dispatch, state }, get.previousWeek(state))
}
