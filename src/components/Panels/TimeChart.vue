<style lang="scss">
#scores {
  padding: 5px 10px;

  .score-body {
    margin: 10px 0;
  }

  .score-footer {
    font-style: italic;
  }

  .score-header {
    .score-btn {
      margin: 0 2px;
    }

    .score-title {
      font-size: 18px;
      font-weight: 300;
      margin-left: 10px;

      a {
        color: #333;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>

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
    #chart-right(v-show="!showScores")

    #scores(v-show="showScores")
      .score-header
        span
          a.score-btn.button.is-small.prev-score-btn.is-disabled
            span.icon.is-small
              i.fa.fa-arrow-left
        span
          a.score-btn.button.is-small.next-score-btn
            span.icon.is-small
              i.fa.fa-arrow-right
        span.score-title
          a(href="https://en.wikipedia.org", target="_blank") Mean Log Score
      .score-body
        table.table.is-striped.is-bordered
          thead
            tr
              th Model
              th 1 wk
              th 2 wk
              th 3 wk
              th 4 wk
          tbody
            tr
              td KCDE
              td 0.29
              td 0.45
              td 0.61
              td 0.68
            tr
              td KCDE
              td 0.29
              td 0.45
              td 0.61
              td 0.68
            tr
              td KCDE
              td 0.29
              td 0.45
              td 0.61
              td 0.68
      .score-footer
        | Calculated using the most recently updated data. Final values may differ.
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
    ]),
    ...mapGetters('models', [
      'modelStatsMeta'
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
