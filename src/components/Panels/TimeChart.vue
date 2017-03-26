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
    // Initialize time chart
    let timechart = new TimeChart('#timechart')

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
