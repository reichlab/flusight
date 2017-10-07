<style lang="scss">
#scores {
  padding: 5px 10px;

  a {
    color: #333;
    &:hover {
      text-decoration: underline;
    }
  }

  .score-body {
    margin: 10px 0;
    max-height: 450px;
    overflow-y: scroll;

    .bold {
      font-weight: bold;
    }
  }

  .score-footer {
    color: gray;
    font-size: 14px;
  }

  .score-header {
    .score-btn {
      margin: 0 2px;
    }

    .score-title {
      font-size: 18px;
      font-weight: 300;
      margin-left: 10px;
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
      li(v-bind:class="[showScoresPanel ? 'is-active' : '']" v-on:click="displayScoresPanel")
        a Scores

  .container
    #chart-right(v-show="!showScoresPanel")

    #scores(v-show="showScoresPanel")
      .score-header
        span
          a.score-btn.button.is-small.prev-score-btn(v-bind:class="[prevScoreActive ? '' : 'is-disabled']" v-on:click="selectPrevScore")
            span.icon.is-small
              i.fa.fa-arrow-left
        span
          a.score-btn.button.is-small.next-score-btn(v-bind:class="[nextScoreActive ? '' : 'is-disabled']" v-on:click="selectNextScore")
            span.icon.is-small
              i.fa.fa-arrow-right
        span.score-title
          a(v-bind:href="modelSelectedScoreMeta.url" target="_blank") {{ modelSelectedScoreMeta.name }}
      .score-body
        table.table.is-striped.is-bordered#score-table
          thead
            tr
              th Model
              th(v-for="hd in modelSelectedScoreMeta.header") {{ hd }}
          tbody
            tr(v-for="(i, id) in modelIds")
              td
                a(v-bind:href="modelMeta[i].url" target="_blank") {{ id }}
              td(v-for="(j, scr) in modelScores[i]" v-bind:class="[modelBestIndices[j] == i ? 'bold' : '']" track-by="$index")
                | {{  scr === null ? 'NA' : parseInt(scr * 1000) / 1000 }}
      .score-footer
        | Calculated using the most recently updated data. Final values may differ.
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import nprogress from 'nprogress'
import tablesort from 'tablesort'

export default {
  computed: {
    ...mapGetters([
      'selectedRegionId',
      'selectedSeasonId'
    ]),
    ...mapGetters('switches', [
      'showTimeChart',
      'showDistributionChart',
      'showScoresPanel',
      'nextScoreActive',
      'prevScoreActive'
    ]),
    ...mapGetters('models', [
      'modelSelectedScoreMeta',
      'modelIds',
      'modelMeta',
      'modelScores',
      'modelBestIndices'
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
      'displayScoresPanel',
      'selectNextScore',
      'selectPrevScore'
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
      tablesort(document.getElementById('score-table'))

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
