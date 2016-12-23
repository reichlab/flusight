import * as types from '../mutation-types'
import * as utils from '../utils'

const state = {
  idx: 0,
  name: null
}

// getters
const getters = {
  selectedWeekIdx: state => state.idx,
  selectedWeekName: state => state.name ? state.name : 'NA',
  weeks: (state, getters, rootState, rootGetters) => {
    let regionSubset = rootState.data[rootGetters.selectedRegion]
    let currentSeasonId = rootGetters.selectedSeason
    let seasonSubset = regionSubset.seasons[currentSeasonId]

    let actual = utils.getMaxLagData(seasonSubset.actual)

    let weeks = actual.map(d => d.week % 100)

    let actualIndices = actual
        .filter(d => d.data !== -1)
        .map(d => weeks.indexOf(d.week % 100))

    console.log(actualIndices)
    return actualIndices
  }
}
// actions
const actions = {
  updateSelectedWeek ({ commit }, val) {
    commit(types.UPDATE_SELECTED_WEEK, val)
  }
}

// mutations
const mutations = {
  [types.UPDATE_SELECTED_WEEK] (state, val) {
    state.idx = val.idx
    state.name = val.name
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
