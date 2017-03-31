<style lang="scss">
</style>

<template lang="pug">
div
  // Main plotting div
  .tabs.is-small
    ul
      li
        a Time Chart
      li.is-active
        a Distribution Chart

  #timechart
</template>

<script>
import { TimeChart, DistributionChart } from 'd3-foresight'
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('models', [
      'modelStatsMeta',
      'modelCIs'
    ])
  },
  methods: {
    ...mapActions([
      'initTimeChart',
      'initDistributionChart',
      'plotTimeChart',
      'plotDistributionChart',
      'updateTimeChart'
    ]),
    ...mapActions('weeks', [
      'updateSelectedWeek'
    ])
  },
  ready () {
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
      confidenceIntervals: this.modelCIs,
      statsMeta: this.modelStatsMeta
    }

    // Initialize time chart
    // let timeChart = new TimeChart('#timechart', timeChartOptions)

    // timeChart.eventHooks.push(eventData => {
    //   if (eventData.type === 'positionUpdate') {
    //     this.updateSelectedWeek(eventData.value)
    //   }
    // })

    // this.initTimeChart(timeChart)

    // // Setup selected data
    // this.plotTimeChart()

    // // Hot start
    // this.updateTimeChart()

    // Override
    let distributionChartConfig = {
      statsMeta: this.modelStatsMeta
    }

    let distributionChart = new DistributionChart('#timechart', distributionChartConfig)

    this.initDistributionChart(distributionChart)
    this.plotDistributionChart()
  }
}
</script>
