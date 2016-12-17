import Vue from 'vue'
import Vuex from 'vuex'

import jsonData from '!json!../assets/data.json'

Vue.use(Vuex)

const state = {

  // D3 plot objects
  timeChart: null,
  choropleth: null,

  // Simple indices of selections
  selected: {
    region: 0, // Handle region selector
    season: 0, // Handle season selector
    week: {
      idx: 0,
      name: null
    } // Week pointer
  },

  // All the data!
  data: jsonData.data,

  // All the metadata!
  metadata: jsonData.metadata,

  // Toggles
  toggles: {
    legend: true,
    intro: true,
    choroplethRelative: false
  },

  // Intro data
  intro: {
    data: [{
      title: 'Welcome to flusight',
      content: `Click <strong>Next</strong> to proceed. Click
                <strong>Finish</strong> to exit this demo.`,
      element: '',
      direction: ''
    }],
    pointer: 0
  }
}

const mutations = {
  UPDATE_SELECTED_REGION (state, val) {
    state.selected.region = val
  },

  UPDATE_SELECTED_SEASON (state, val) {
    state.selected.season = val
  },

  UPDATE_SELECTED_WEEK (state, val) {
    state.selected.week = val
  },

  SET_TIMECHART (state, val) {
    state.timeChart = val
  },

  SET_CHOROPLETH (state, val) {
    state.choropleth = val
  },

  INCREMENT_INTRO_POINTER (state) {
    state.intro.pointer += 1
  },

  DECREMENT_INTRO_POINTER (state) {
    state.intro.pointer -= 1
  },

  RESET_INTRO_POINTER (state) {
    state.intro.pointer = 0
  },

  HIDE_INTRO (state) {
    state.toggles.intro = false
  },

  SHOW_INTRO (state) {
    state.toggles.intro = true
  },

  APPEND_INTRO_ITEM (state, val) {
    state.intro.data.push(val)
  },

  TOGGLE_LEGEND (state) {
    state.toggles.legend = !state.toggles.legend
  },

  TOGGLE_CHOROPLETH_RELATIVE (state) {
    state.toggles.choroplethRelative = !state.toggles.choroplethRelative
  }
}

export default new Vuex.Store({
  state,
  mutations
})
