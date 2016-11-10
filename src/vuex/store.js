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
      name: 'NA'
    }, // Week pointer
    choropleth: 0 // Choropleth selector
  },

  // All the data!
  data: jsonData.data,

  // All the metadata!
  metadata: jsonData.metadata,

  // Introduction steps data
  introData: [{
    title: 'Welcome to flusight',
    content: 'Click <strong>Next</strong> to proceed. Click <strong>Finish</strong> to exit this demo.',
    element: '',
    direction: ''
  }],

  introPointer: 0,
  introShow: true
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

  UPDATE_SELECTED_CHOROPLETH (state, val) {
    state.selected.choropleth = val
  },

  SET_TIMECHART (state, val) {
    state.timeChart = val
  },

  SET_CHOROPLETH (state, val) {
    state.choropleth = val
  },

  INCREMENT_INTRO_POINTER (state) {
    state.introPointer += 1
  },

  DECREMENT_INTRO_POINTER (state) {
    state.introPointer -= 1
  },

  RESET_INTRO_POINTER (state) {
    state.introPointer = 0
  },

  HIDE_INTRO (state) {
    state.introShow = false
  },

  SHOW_INTRO (state) {
    state.introShow = true
  },

  APPEND_INTRO_ITEM (state, val) {
    state.introData.push(val)
  }
}

export default new Vuex.Store({
  state,
  mutations
})
