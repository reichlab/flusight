import * as types from './mutation-types'
import { TimeChart, DistributionChart } from 'd3-foresight'

// Initializations
// ---------------
export const initData = ({ commit, getters }, val) => {
  if (!getters.data) {
    commit(types.SET_DATA, val)
  }
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

  let timeChart = new TimeChart(divSelector, timeChartOptions)

  timeChart.eventHooks.push(eventData => {
    if (eventData.type === 'positionUpdate') {
      dispatch('weeks/updateSelectedWeek', eventData.value)
    }
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

  let distributionChart = new DistributionChart(divSelector, distributionChartConfig)
  commit(types.SET_DISTRIBUTIONCHART, distributionChart)
}

// Plotting (data-changing) actions
// --------------------------------

/**
 * Plot (update) time chart with region / season data
 */
export const plotTimeChart = ({ dispatch, getters }) => {
  getters.timeChart.plot(getters.timeChartData)
  dispatch('weeks/resetToFirstIdx')
  dispatch('updateTimeChart')
}

/**
 * Plot distribution chart
 */
export const plotDistributionChart = ({ getters }) => {
  getters.distributionChart.plot(getters.distributionChartData)
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
  getters.timeChart.update(getters['weeks/selectedWeekIdx'])
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
