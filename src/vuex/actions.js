// Vuex actions

export const initializeData = ({ dispatch, state }, val) => {
  dispatch('INITIALIZE_DATA', val)
}

export const updateModel = ({ dispatch, state }, e) => {
  dispatch('UPDATE_MODEL', state.models.indexOf(e.target.value))
}

export const updateSeason = ({ dispatch, state }, e) => {
  dispatch('UPDATE_SEASON', state.seasons.indexOf(e.target.value))
}

export const updateRegion = ({ dispatch, state }, e) => {
  dispatch('UPDATE_REGION', state.regions.indexOf(e.target.value))
}

export const setChart = ({ dispatch, state }, val) => {
  dispatch('SET_CHART', val)
}

export const setMap = ({ dispatch, state }, val) => {
  dispatch('SET_MAP', val)
}
