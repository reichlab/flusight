import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const state = {
  // Initial State
  metadata: {
    title: 'flusight',
    parent: 'reichlab',
    sourceUrl: 'https://github.com/reichlab/flusight',
    parentUrl: 'https://reichlab.github.io',
    licenseUrl: 'https://opensource.org/licenses/GPL-3.0'
  },

  // D3 stuff
  chart: null,
  map: null,

  regions: [
    'National',
    'Region 1 [CT, MA, ME, NH, RI, VT]',
    'Region 2 [NJ, NY]',
    'Region 3 [DE, MD, PA, VA, WV]',
    'Region 4 [AL, FL, GA, KY, MS, NC, SC, TN]',
    'Region 5 [IL, IN, MI, MN, OH, WI]',
    'Region 6 [AR, LA, NM, OK, TX]',
    'Region 7 [IA, KS, MO, NE]',
    'Region 8 [CO, MT, ND, SD, UT, WY]',
    'Region 9 [AZ, CA, HI, NV]',
    'Region 10 [AK, ID, OR, WA]'
  ],

  seasons: [
    '2015-2016 (Current)',
    '2014-2015'
  ],

  models: [
    'Model A',
    'Model B'
  ],

  selected: {
    region: 0,
    season: 0,
    model: 0
  }
}

const mutations = {
  UPDATE_MODEL (state, val) {
    state.selected.model = val
  },

  UPDATE_REGION (state, val) {
    state.selected.region = val
  },

  UPDATE_SEASON (state, val) {
    state.selected.season = val
  },

  SET_CHART (state, val) {
    state.chart = val
  },

  SET_MAP (state, val) {
    state.map = val
  }
}

export default new Vuex.Store({
  state,
  mutations
})
