<style lang="scss">

.datamaps-subunit {
  cursor: pointer;
}

#choropleth {
  text-align: center;

  #relative-button {
      position: absolute;
      text-align: left;
      font-size: 12px;
      .icon {
          margin-right: 10px;
          cursor: pointer;
      }
      span {
          vertical-align: middle;
      }
  }
}

#selectors {
  .level {
      margin-bottom: 0px;
  }
}

#choropleth-tooltip {
  position: fixed;
  padding: 10px;
  box-shadow: 0px 0px 2px;
  border-radius: 1px;
  background-color: white;
  font-size: 11px;

  .value {
    font-size: 12px;
    font-weight: bold;
  }
}

.colorbar-group .axis {
  line, path {
    fill: none;
    stroke: #bbb !important;
  }
}

</style>

<template lang="pug">
div
  // Title
  h1.title
    | Real-time <b>Influenza Forecasts</b>
  h2.subtitle
    | CDC FluSight Challenge

  hr

  // Info and selector
  #selectors
    .level.is-mobile
      .level-left
        .level-item
          .heading Week <b>{{ selectedWeekName }}</b>
          .subtitle {{ regions[selectedRegion] }}


      .level-right
        .level-item
            p.heading Season
            p.control.title
              span.select.is-small
                select(v-model="currentSeason")
                  option(v-for="season in seasons") {{ season }}


  // Main plotting div
  #choropleth

    #relative-button
      span.icon
        i.fa.fa-toggle-off
      span Show relative values
</template>

<script>
import Choropleth from '../../modules/choropleth'
import {
  initChoropleth,
  updateSelectedRegion,
  updateSelectedSeason,
  updateSelectedChoropleth,
  updateSelectedModel,
  plotChoropleth,
  updateChoropleth
} from '../../vuex/actions'
import {
  selectedChoropleth,
  selectedWeekName,
  selectedModel,
  selectedSeason,
  selectedRegion,
  choropleths,
  models,
  seasons,
  regions
} from '../../vuex/getters'

export default {
  vuex: {
    actions: {
      initChoropleth,
      updateSelectedRegion,
      updateSelectedChoropleth,
      updateSelectedSeason,
      updateSelectedModel,
      plotChoropleth,
      updateChoropleth
    },
    getters: {
      selectedChoropleth,
      selectedWeekName,
      selectedModel,
      selectedSeason,
      selectedRegion,
      choropleths,
      models,
      seasons,
      regions
    }
  },
  computed: {
    currentChoropleth: {
      get() {
        return this.choropleths[this.selectedChoropleth]
      },
      set(val) {
        this.updateSelectedChoropleth(this.choropleths.indexOf(val))
      }
    },
    currentModel: {
      get() {
        return this.models[this.selectedModel]
      },
      set(val) {
        this.updateSelectedModel(this.models.indexOf(val))
      }
    },
    currentSeason: {
      get() {
        return this.seasons[this.selectedSeason]
      },
      set(val) {
        this.updateSelectedSeason(this.seasons.indexOf(val))
      }
    }
  },
  ready() {
    // Setup map
    this.initChoropleth(new Choropleth(this.$d3, 'choropleth', (regionId) => {
      this.updateSelectedRegion(regionId)
    }))

    // Setup data
    this.plotChoropleth()

    // Hot start
    this.updateChoropleth()
  }
}
</script>
