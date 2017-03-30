<style lang="scss">
</style>

<template lang="pug">
div
  // Main plotting div
  #timechart
</template>

<script>
import { TimeChart } from 'd3-foresight'
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions([
      'initTimeChart',
      'plotTimeChart',
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
      pointType: 'mmwr-week'
    }

    // Initialize time chart
    let timechart = new TimeChart('#timechart', timeChartOptions)

    timechart.eventHooks.push(eventData => {
      if (eventData.type === 'positionUpdate') {
        this.updateSelectedWeek(eventData.value)
      }
    })

    this.initTimeChart(timechart)

    // Setup selected data
    this.plotTimeChart()

    // Hot start
    this.updateTimeChart()
  }
}
</script>
