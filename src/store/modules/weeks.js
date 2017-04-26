import * as types from '../mutation-types'

const state = {
  pointer: 0
}

// getters
const getters = {
  selectedWeekIdx: state => state.pointer,
  selectedWeekName: (state, getters) => {
    let text = getters.weeks[getters.selectedWeekIdx]
    text += ' ('
    text += Math.floor(getters.years[getters.selectedWeekIdx])
    text += ')'
    return text
  },
  weeks: (state, getters, rootState, rootGetters) => {
    return rootGetters.timePoints.map(d => d.week)
  },
  years: (state, getters, rootState, rootGetters) => {
    return rootGetters.timePoints.map(d => d.year)
  },
  actualIndices: (state, getters, rootState, rootGetters) => {
    return rootGetters.actual.map((d, idx) => {
      return (d ? idx : null)
    }).filter(d => d !== null)
  },
  actualFirst: (state, getters) => getters.actualIndices[0],
  actualLast: (state, getters) => {
    return getters.actualIndices[getters.actualIndices.length - 1]
  },
  firstPlottingWeekIdx: (state, getters, rootState, rootGetters) => {
    // Check if season is current
    let isLiveSeason = getters.actualIndices.length < rootGetters.timePoints.length

    if (isLiveSeason) {
      // Start at the latest prediction
      return Math.max(...rootGetters['models/models'].map(m => {
        let index = m.predictions.length - 1
        for (let i = index; i >= 0; i--) {
          if (m.predictions[i] !== null) return i
        }
        return 0
      }))
    } else {
      // Start at the first prediction
      let modelPredictions = rootGetters['models/models'].map(m => {
        for (let i = 0; i < m.predictions.length; i++) {
          if (m.predictions[i] !== null) return i
        }
        return 0
      })

      if (modelPredictions.length === 0) {
        // Start at the most recent actual data
        return getters.actualIndices[getters.actualIndices.length - 1]
      } else {
        return Math.min(...modelPredictions)
      }
    }
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
