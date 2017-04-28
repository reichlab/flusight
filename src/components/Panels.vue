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
    ]),
    ...mapActions('weeks', [
      'readjustSelectedWeek'
    ])
  },
  watch: {
    selectedRegion: function () {
      // Jiggle weeks
      this.readjustSelectedWeek()
      this.plotTimeChart()
      this.plotDistributionChart()
      this.updateChoropleth()
    },
    selectedSeason: function () {
      // Jiggle weeks
      this.readjustSelectedWeek()
      this.plotTimeChart()
      this.plotChoropleth()
      this.plotDistributionChart()
    },
    choroplethRelative: function () {
      this.plotChoropleth()
    },
    selectedWeekIdx: function () {
      this.updateChoropleth()
      this.updateTimeChart()
      this.plotDistributionChart()
    }
  }
}
</script>
