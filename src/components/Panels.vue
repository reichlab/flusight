<style lang="scss" scoped>

.columns {
  .column {
    position: relative;
  }
}

#choropleth-container, #timechart-container {
  background: white;
}

</style>

<template lang="pug">
.columns
  #map-intro.column.is-4
    // Title
    h1.title
      | Real-time <b>Influenza Forecasts</b>
    h2.subtitle
      | CDC FluSight Challenge
    hr

    #choropleth-container
      choropleth
  #timechart-container.column.is-8
    time-chart
</template>

<script>
import Choropleth from './Panels/Choropleth'
import TimeChart from './Panels/TimeChart'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Choropleth,
    TimeChart
  },
  computed: {
    ...mapGetters('switches', [
      'selectedRegion',
      'selectedSeason',
      'choroplethRelative'
    ]),
    ...mapGetters('weeks', [
      'selectedWeekIdx'
    ])
  },
  methods: {
    ...mapActions([
      'updateTimeChart',
      'updateChoropleth',
      'plotChoropleth',
      'plotTimeChart',
      'plotDistributionChart'
    ])
  },
  watch: {
    selectedRegion: function () {
      // Triggered by
      // - selector
      // - map clicks
      // Time series gets new data
      // Choropleth gets highlight
      this.plotTimeChart()
      // this.plotDistributionChart()
      this.updateChoropleth()
    },
    selectedSeason: function () {
      // Triggered by selector
      // Choropleth gets new plot
      // Time series gets new data
      this.plotTimeChart()
      this.plotChoropleth()
      // this.plotDistributionChart()
    },
    choroplethRelative: function () {
      // Triggered by relative selector
      // Use specific choropleth getter and do a plot
      this.plotChoropleth()
    },
    selectedWeekIdx: function () {
      // Triggered by
      // - nav buttons
      // - mouse jumps
      // - keyboard
      // Choropleth gets transitions
      // Time series gets transitions
      this.updateChoropleth()
      this.updateTimeChart()
      // this.plotDistributionChart()
    }
  }
}
</script>
