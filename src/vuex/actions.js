// Vuex actions

export const initializeData = ({ dispatch, state }, val) => {
  dispatch('INITIALIZE_DATA', val)
}

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
