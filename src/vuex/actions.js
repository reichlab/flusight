// Vuex actions

export const updateSelectedModel = ({ dispatch, state }, val) => {
  dispatch('UPDATE_SELECTED_MODEL', val)
}

export const updateSelectedSeason = ({ dispatch, state }, val) => {
  dispatch('UPDATE_SELECTED_SEASON', val)
}

export const updateSelectedRegion = ({ dispatch, state }, val) => {
  dispatch('UPDATE_SELECTED_REGION', val)
}

export const setChart = ({ dispatch, state }, val) => {
  dispatch('SET_CHART', val)
}

export const setMap = ({ dispatch, state }, val) => {
  dispatch('SET_MAP', val)
}

export const plotChart = ({ dispatch, state }, val) => {
  state.chart.plotActual(val)
}

export const stepForward = ({ dispatch, state }, val) => {
  state.chart.stepForward()
}

export const stepBackward = ({ dispatch, state }, val) => {
  state.chart.stepBackward()
}
