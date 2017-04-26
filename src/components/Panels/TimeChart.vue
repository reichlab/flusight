<style lang="scss">
</style>

<template lang="pug">
div
  // Main plotting div
  .tabs.is-small
    ul
      li(v-bind:class="[showTimeChart ? 'is-active' : '']" v-on:click="displayTimeChart")
        a Time Chart
      li.disabled(v-bind:class="[showDistributionChart ? 'is-active' : '']") 
        a Distribution Chart

  .container
    #timechart
    #distributionchart
</template>

<script>
import { TimeChart } from 'd3-foresight'
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('models', [
      'modelStatsMeta',
      'modelCIs'
    ]),
    ...mapGetters('switches', [
      'showTimeChart',
      'showDistributionChart'
    ]),
    ...mapGetters('weeks', [
      'firstPlottingWeekIdx'
    ])
  },
  methods: {
    ...mapActions([
      'initData',
      'initTimeChart',
      'initDistributionChart',
      'plotTimeChart',
      'plotDistributionChart',
      'updateTimeChart'
    ]),
    ...mapActions('weeks', [
      'updateSelectedWeek',
    ]),
    ...mapActions('switches', [
      'displayTimeChart',
      'displayDistributionChart'
    ])
  },
  ready () {
    require.ensure(['../../store/data.js'], () => {
      this.initData(require('../../store/data.js'))

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

      let timeChart = new TimeChart('#timechart', timeChartOptions)

      timeChart.eventHooks.push(eventData => {
        if (eventData.type === 'positionUpdate') {
          this.updateSelectedWeek(eventData.value)
        }
      })

      this.initTimeChart(timeChart)
      this.plotTimeChart()
      this.updateSelectedWeek(this.firstPlottingWeekIdx)

      // let distributionChartConfig = {
      //   statsMeta: this.modelStatsMeta,
      //   axes: {
      //     x: {
      //       title: ['Epidemic', 'Week'],
      //       description: `Week of the calendar year, as measured by the CDC.
      //                     <br><br><em>Click to know more</em>`,
      //       url: 'https://wwwn.cdc.gov/nndss/document/MMWR_Week_overview.pdf'
      //     }
      //   }
      // }

      // let distributionChart = new DistributionChart('#distributionchart', distributionChartConfig)

      // this.initDistributionChart(distributionChart)
      // this.plotDistributionChart()

      window.loading_screen.finish()
    })
  }
}
</script>
