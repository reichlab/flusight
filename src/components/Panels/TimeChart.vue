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
      'plotDistributionChart'
    ]),
    ...mapActions('switches', [
      'displayTimeChart',
      'displayDistributionChart'
    ])
  },
  ready () {
    require.ensure(['../../store/data.js'], () => {
      this.initData(require('../../store/data.js'))

      this.initTimeChart('#chart-right')
      this.plotTimeChart()

      // this.initDistributionChart('#chart-right')
      // this.plotDistributionChart()

      window.loading_screen.finish()
    })
  } 
}
</script>
