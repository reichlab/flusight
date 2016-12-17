import * as get from './getters'

// Vuex actions

export const updateSelectedSeason = ({ dispatch, state }, val) => {
  dispatch('UPDATE_SELECTED_SEASON', val)
}

export const updateSelectedRegion = ({ dispatch, state }, val) => {
  if (get.selectedRegion(state) === val) {
    // Trigger deselection
    // Select `national` region
    dispatch('UPDATE_SELECTED_REGION', 0)
  } else {
    dispatch('UPDATE_SELECTED_REGION', val)
  }
}

export const updateSelectedWeek = ({ dispatch, state }, val) => {
  dispatch('UPDATE_SELECTED_WEEK', val)
}

export const updateSelectedChoropleth = ({ dispatch, state }, val) => {
  dispatch('UPDATE_SELECTED_CHOROPLETH', val)
}

export const updateSelectedModel = ({ dispatch, state }, val) => {
  dispatch('UPDATE_SELECTED_MODEL', val)
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
  let data = get.timeChartData(state)

  get.timeChart(state).plot(data)
}

/**
 * Plot (update) choropleth with currently selected data
 */
export const plotChoropleth = ({ dispatch, state }) => {
  let data = get.choroplethData(state)

  get.choropleth(state).plot(data)
  updateChoropleth({ dispatch, state })
}

/**
 * Tell time chart to move markers to weekIdx
 */
export const updateTimeChart = ({ dispatch, state }) => {
  get.timeChart(state).update(get.selectedWeekIdx(state))
}

/**
 * Tell choropleth to move to weekidx and highlight a region
 */
export const updateChoropleth = ({ dispatch, state }) => {
  let payload = {
    weekIdx: get.selectedWeekIdx(state),
    regionIdx: get.selectedRegion(state) - 1
  }

  get.choropleth(state).update(payload)
}

/**
 * Update week pointer in main store
 * and let watchers take care of everything else
 */
export const forward = ({ dispatch, state }) => {
  updateSelectedWeek({ dispatch, state }, get.nextWeek(state))
}

/**
 * Update week pointer in main store
 * and let watchers take care of everything else
 */
export const backward = ({ dispatch, state }) => {
  updateSelectedWeek({ dispatch, state }, get.previousWeek(state))
}

/**
 * Toggle display of legend control
 */
export const toggleLegend = ({ dispatch, state }) => {
  dispatch('TOGGLE_LEGEND')
}

/**
 * Toggle relative display in choropleth
 */
export const toggleRelative = ({ dispatch, state }) => {
  dispatch('TOGGLE_CHOROPLETH_RELATIVE')
}

// Introduction actions

export const appendIntroItems = ({ dispatch, state }, items) => {
  items.map(item => {
    dispatch('APPEND_INTRO_ITEM', item)
  })
}

export const moveIntroStart = ({ dispatch, state }) => {
  dispatch('RESET_INTRO_POINTER')
  dispatch('SHOW_INTRO')
  if (!get.legendShow(state)) {
    toggleLegend({ dispatch, state })
  }
}

export const moveIntroForward = ({ dispatch, state }) => {
  if (get.introAtLast(state)) {
    // Hide
    dispatch('HIDE_INTRO')
  } else {
    dispatch('INCREMENT_INTRO_POINTER')
  }

  if (!get.legendShow(state)) {
    toggleLegend({ dispatch, state })
  }
}

export const moveIntroBackward = ({ dispatch, state }) => {
  dispatch('DECREMENT_INTRO_POINTER')

  if (!get.legendShow(state)) {
    toggleLegend({ dispatch, state })
  }
}

export const moveIntroFinish = ({ dispatch, state }) => {
  dispatch('HIDE_INTRO')
}
