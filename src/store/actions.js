import * as types from './mutation-types'
import * as d3 from 'd3'
import { TimeChart, DistributionChart } from 'd3-foresight'

// Initializations
// ---------------
export const addSeasonData = ({ commit, getters }, val) => {
  if (getters.downloadedSeasons.indexOf(val.seasonId) === -1) {
    commit(types.ADD_SEASON_DATA, val)
  }
}

export const initMetadata = ({ commit, getters }, val) => {
  if (!getters.metadata) {
    commit(types.SET_METADATA, val)
  }
}

export const initSeasonDataUrls = ({ commit, getters }, val) => {
  if (!getters.seasonDataUrls) {
    commit(types.SET_SEASON_DATA_URLS, val)
  }
}

export const initHistory = ({ commit, getters }, val) => {
  if (!getters.history) {
    commit(types.SET_HISTORY, val)
  }
}

export const setBrandLogo = ({ commit, getters }, val) => {
  commit(types.SET_BRAND_LOGO, val)
}

export const initTimeChart = ({ commit, getters, dispatch }, divSelector) => {
  let timeChartOptions = {
    baseline: {
      text: ['CDC', 'Baseline'],
      description: `Baseline ILI value as defined by CDC.
                    <br><br><em>Click to know more</em>`,
      url: 'http://www.cdc.gov/flu/weekly/overview.htm'
    },
    axes: {
      x: {
        title: ['Epidemic', 'Week'],
        description: `Week of the calendar year, as measured by the CDC.
                      <br><br><em>Click to know more</em>`,
        url: 'https://wwwn.cdc.gov/nndss/document/MMWR_Week_overview.pdf'
      },
      y: {
        title: 'Weighted ILI (%)',
        description: `Percentage of outpatient doctor visits for
                      influenza-like illness, weighted by state population.
                      <br><br><em>Click to know more</em>`,
        url: 'http://www.cdc.gov/flu/weekly/overview.htm'
      }
    },
    pointType: 'mmwr-week',
    confidenceIntervals: getters['models/modelCIs'],
    statsMeta: getters['models/modelStatsMeta']
  }

  // Clear div
  d3.select(divSelector).selectAll('*').remove()
  let timeChart = new TimeChart(divSelector, timeChartOptions)

  timeChart.addHook('forward-index', () => {
    dispatch('weeks/forwardSelectedWeek')
  })

  timeChart.addHook('backward-index', () => {
    dispatch('weeks/backwardSelectedWeek')
  })

  timeChart.addHook('jump-to-index', (index) => {
    dispatch('weeks/updateSelectedWeek', index)
    dispatch('weeks/readjustSelectedWeek')
  })

  commit(types.SET_TIMECHART, timeChart)
}

export const initChoropleth = ({ commit }, val) => {
  commit(types.SET_CHOROPLETH, val)
}

export const initDistributionChart = ({ commit, getters, dispatch }, divSelector) => {
  let distributionChartConfig = {
    statsMeta: getters['models/modelStatsMeta'],
    axes: {
      x: {
        title: ['Epidemic', 'Week'],
        description: `Week of the calendar year, as measured by the CDC.
                      <br><br><em>Click to know more</em>`,
        url: 'https://wwwn.cdc.gov/nndss/document/MMWR_Week_overview.pdf'
      }
    }
  }

  // Clear div
  d3.select(divSelector).selectAll('*').remove()
  let distributionChart = new DistributionChart(divSelector, distributionChartConfig)

  distributionChart.addHook('forward-index', () => {
    dispatch('weeks/forwardSelectedWeek')
  })

  distributionChart.addHook('backward-index', () => {
    dispatch('weeks/backwardSelectedWeek')
  })

  distributionChart.addHook('jump-to-index', (index) => {
    dispatch('weeks/updateSelectedWeek', index)
    dispatch('weeks/readjustSelectedWeek')
  })

  commit(types.SET_DISTRIBUTIONCHART, distributionChart)
}

// Plotting (data-changing) actions
// --------------------------------

/**
 * Plot (update) time chart with region / season data
 */
export const plotTimeChart = ({ dispatch, getters }) => {
  if (getters.timeChart) {
    getters.timeChart.plot(getters.timeChartData)
    dispatch('weeks/readjustSelectedWeek')
    dispatch('updateTimeChart')
  }
}

/**
 * Plot distribution chart
 */
export const plotDistributionChart = ({ getters }) => {
  if (getters.distributionChart) {
    getters.distributionChart.plot(getters.distributionChartData)
  }
}

/**
 * Plot (update) choropleth with currently selected data
 */
export const plotChoropleth = ({ commit, dispatch, getters }) => {
  getters.choropleth.plot(getters.choroplethData)
  dispatch('updateChoropleth')
}

/**
 * Tell time chart to move markers to weekIdx
 */
export const updateTimeChart = ({ getters }) => {
  if (getters.timeChart) {
    getters.timeChart.update(getters['weeks/selectedWeekIdx'])
  }
}

/**
 * Tell choropleth to move to weekidx and highlight a region
 */
export const updateChoropleth = ({ getters }) => {
  let payload = {
    weekIdx: getters['weeks/selectedWeekIdx'],
    regionIdx: getters['switches/selectedRegion'] - 1
  }

  getters.choropleth.update(payload)
}

/**
 * Clear timeChart
 */
export const clearTimeChart = ({ commit }) => {
  commit(types.SET_TIMECHART, null)
}

/**
 * Clear distributionChart
 */
export const clearDistributionChart = ({ commit }) => {
  commit(types.SET_DISTRIBUTIONCHART, null)
}
