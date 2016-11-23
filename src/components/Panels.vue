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
  #choropleth-container.column.is-4
    choropleth
  #timechart-container.column.is-8
    time-chart
</template>

<script>
import Choropleth from './Panels/Choropleth'
import TimeChart from './Panels/TimeChart'
import {
  selectedRegion,
  selectedSeason,
  selectedWeekIdx,
  choroplethRelative
} from '../vuex/getters'
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
    getters: {
      selectedRegion,
      selectedSeason,
      selectedWeekIdx,
      choroplethRelative
    },
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
      this.updateTimeChart()
    },
    selectedSeason: function() {
      // Triggered by selector
      // Choropleth gets new plot
      // Time series gets new data
      this.plotTimeChart()
      this.plotChoropleth()
    },
    choroplethRelative: function() {
      // Triggered by relative selector
      // Use specific choropleth getter and do a plot
      this.plotChoropleth()
    },
    selectedWeekIdx: function() {
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
