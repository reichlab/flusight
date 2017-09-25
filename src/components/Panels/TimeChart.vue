<template lang="pug">
div
  // Main plotting div
  .tabs.is-small
    ul
      li(v-bind:class="[showTimeChart ? 'is-active' : '']" v-on:click="displayTimeChart")
        a Time Chart
      li(v-bind:class="[showDistributionChart ? 'is-active' : '']" v-on:click="displayDistributionChart") 
        a Distribution Chart
      li(v-bind:class="[showScores ? 'is-active' : '']" v-on:click="displayScores")
        a Scores

  .container
    #chart-right
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import nprogress from 'nprogress'

export default {
  computed: {
    ...mapGetters([
      'selectedRegionId',
      'selectedSeasonId'
    ]),
    ...mapGetters('switches', [
      'showTimeChart',
      'showDistributionChart',
      'showScores'
    ])
  },
  methods: {
    ...mapActions([
      'importLatestChunk',
      'initTimeChart',
      'initDistributionChart',
      'plotTimeChart',
      'plotDistributionChart',
      'clearTimeChart',
      'clearDistributionChart',
      'downloadSeasonData',
      'downloadDistData'
    ]),
    ...mapActions('switches', [
      'displayTimeChart',
      'displayDistributionChart',
      'displayScores'
    ]),
    ...mapActions('weeks', [
      'readjustSelectedWeek',
      'resetToFirstIdx'
    ])
  },
  ready () {
    require.ensure(['../../store/data'], () => {
      this.importLatestChunk(require('../../store/data'))

      this.resetToFirstIdx()
      this.displayTimeChart()

      window.loading_screen.finish()
    })
  },
  watch: {
    showTimeChart: function () {
      this.readjustSelectedWeek()
      if (this.showTimeChart) {
        // Check if we need to download chunks
        nprogress.start()
        this.downloadSeasonData({
          http: this.$http,
          id: this.selectedSeasonId,
          success: () => {
            this.initTimeChart('#chart-right')
            this.plotTimeChart()
            nprogress.done()
          },
          fail: err => console.log(err)
        })
      } else {
        this.clearTimeChart()
      }
    },
    showDistributionChart: function () {
      if (this.showDistributionChart) {
        // Check if we need to download chunks
        nprogress.start()
        this.downloadDistData({
          http: this.$http,
          id: `${this.selectedSeasonId}-${this.selectedRegionId}`,
          success: () => {
            this.initDistributionChart('#chart-right')
            this.plotDistributionChart()
            nprogress.done()
          },
          fail: err => console.log(err)
        })
      } else {
        this.clearDistributionChart()
      }
    }
  }
}
</script>
