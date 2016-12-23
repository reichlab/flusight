import * as types from '../mutation-types'

const state = {
  pointer: 0
}

// getters
const getters = {
  selectedWeekIdx: state => state.pointer,
  selectedWeekName: (state, getters) => {
    if (getters.weeks[state.pointer]) return getters.weeks[state.pointer]
    else return 'NA'
  },
  weeks: (state, getters, rootState, rootGetters) => {
    return rootGetters.actual.map(d => d.week % 100)
  },
  actualIndices: (state, getters, rootState, rootGetters) => {
    return rootGetters.actual
        .filter(d => d.data !== -1)
        .map(d => getters.weeks.indexOf(d.week % 100))
  },
  actualFirst: (state, getters) => getters.actualIndices[0],
  actualLast: (state, getters) => {
    return getters.actualIndices[getters.actualIndices.length - 1]
  }
}

// actions
const actions = {
  updateSelectedWeek ({ commit, getters }, val) {
    let capped = Math.max(Math.min(getters.actualLast, val), getters.actualFirst)
    commit(types.UPDATE_SELECTED_WEEK, capped)
  },

  forwardSelectedWeek ({ commit, getters }) {
    let idx = Math.min(getters.weeks.length - 1, getters.selectedWeekIdx + 1)
    let capped = Math.max(Math.min(getters.actualLast, idx), getters.actualFirst)
    commit(types.UPDATE_SELECTED_WEEK, capped)
  },

  backwardSelectedWeek ({ commit, getters }) {
    let idx = Math.max(0, getters.selectedWeekIdx - 1)
    let capped = Math.max(Math.min(getters.actualLast, idx), getters.actualFirst)
    commit(types.UPDATE_SELECTED_WEEK, capped)
  }
}

// mutations
const mutations = {
  [types.UPDATE_SELECTED_WEEK] (state, val) {
    state.pointer = val
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
