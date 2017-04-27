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
      'initData',
      'initTimeChart',
      'initDistributionChart',
      'plotTimeChart',
      'plotDistributionChart',
      'clearTimeChart',
      'clearDistributionChart'
    ]),
    ...mapActions('switches', [
      'displayTimeChart',
      'displayDistributionChart'
    ])
  },
  ready () {
    require.ensure(['../../store/data.js'], () => {
      this.initData(require('../../store/data.js'))

      this.displayTimeChart()

      window.loading_screen.finish()
    })
  },
  watch: {
    showTimeChart: function () {
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
