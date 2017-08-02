<template lang="pug">
div
  // Main plotting div
  .tabs.is-small
    ul
      li(v-bind:class="[showTimeChart ? 'is-active' : '']" v-on:click="displayTimeChart")
        a Time Chart
      li(v-bind:class="[showDistributionChart ? 'is-active' : '']" v-on:click="displayDistributionChart") 
        a Distribution Chart

  .container
    #chart-right
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('switches', [
      'showTimeChart',
      'showDistributionChart'
    ])
  },
  methods: {
    ...mapActions([
      'addSeasonData',
      'initMetadata',
      'initHistory',
      'initTimeChart',
      'initDistributionChart',
      'initSeasonDataUrls',
      'plotTimeChart',
      'plotDistributionChart',
      'clearTimeChart',
      'clearDistributionChart'
    ]),
    ...mapActions('switches', [
      'displayTimeChart',
      'displayDistributionChart'
    ]),
    ...mapActions('weeks', [
      'readjustSelectedWeek',
      'resetToFirstIdx'
    ])
  },
  ready () {
    require.ensure(['../../store/data'], () => {
      let dataChunk = require('../../store/data')

      this.initSeasonDataUrls(dataChunk.seasonDataUrls)
      this.addSeasonData(dataChunk.latestSeasonData)
      this.initMetadata(dataChunk.metadata)
      this.initHistory(dataChunk.history)

      this.resetToFirstIdx()
      this.displayTimeChart()

      window.loading_screen.finish()
    })
  },
  watch: {
    showTimeChart: function () {
      this.readjustSelectedWeek()
      if (this.showTimeChart) {
        this.initTimeChart('#chart-right')
        this.plotTimeChart()
      } else {
        this.clearTimeChart()
      }
    },
    showDistributionChart: function () {
      if (this.showDistributionChart) {
        this.initDistributionChart('#chart-right')
        this.plotDistributionChart()
      } else {
        this.clearDistributionChart()
      }
    }
  }
}
</script>
