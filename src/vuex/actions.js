// Vuex actions

export const updateModel = ({ dispatch, state }, e) => {
  dispatch('UPDATE_MODEL', state.models.indexOf(e.target.value))
}

export const updateSeason = ({ dispatch, state }, e) => {
  dispatch('UPDATE_SEASON', state.seasons.indexOf(e.target.value))
}

export const updateRegion = ({ dispatch, state }, e) => {
  dispatch('UPDATE_REGION', state.regions.indexOf(e.target.value))
}
