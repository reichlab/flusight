<style lang="scss">
</style>

<template>
    <div class="columns">
        <div class="column is-4">
            <choropleth></choropleth>
        </div>

        <div class="column id-8">
            <time-chart></time-chart>
        </div>
    </div>
</template>

<script>
  import Choropleth from './Panels/Choropleth'
  import TimeChart from './Panels/TimeChart'
  import {
    updateTimeChart,
    updateChoropleth,
    plotTimeChart,
    plotChoropleth
  } from '../vuex/actions'

  export default {
    components: {
      Choropleth,
      TimeChart
    },
    vuex: {
      actions: {
        updateTimeChart,
        updateChoropleth,
        plotChoropleth,
        plotTimeChart
      }
    },
    watch: {
      selectedRegion: function() {
        // Triggered by
        // - selector
        // - map clicks
        // Time series gets new data
        // Choropleth gets highlight
        this.plotTimeChart()
        this.updateChoropleth()
      },
      selectedSeason: function() {
        // Triggered by selector
        // Choropleth gets new plot
        // Time series gets new data
        this.plotTimeChart()
        this.plotChoropleth()
      },
      selectedChoropleth: function() {
        // Triggered by selector
        // Use specfic choropleth getter and do a plot
        this.plotChoropleth()
      },
      selectedWeek: function() {
        // Triggered by
        // - nav buttons
        // - mouse jumps
        // - keyboard
        // Choropleth gets transitions
        // Time series gets transitions
        this.updateChoropleth()
        this.updateTimeChart()
      }
    }
  }
</script>
