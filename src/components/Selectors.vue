<style lang="scss" scoped>

.hero-body {
  padding: 5px 0px;
  .box {
    padding: 10px 15px;
    margin: 15px 0px;
    border-radius: 2px;
  }
  .bold {
    font-weight: bold;
  }
  @media (max-width: 980px) {
    .level-left .container {
      text-align: center;
      padding: 20px 0px;
    }
  }
}

</style>

<template lang="pug">
section.hero.is-light
  .hero-body
    .container
      nav.level
        // Title
        .level-left
          .container
            h1.title
              | Real-time <span class="bold">Influenza Forecasts</span>
            h2.subtitle
              | CDC FluSight Challenge

        // Selectors
        #main-selectors.level-right.box
          .level-item
            p.heading Region
            p.control.title
              span.select.is-small
                select(v-model="currentRegion")
                  option(v-for="region in regions") {{ region }}

          .level-item
            p.heading Season
            p.control.title
              span.select.is-small
                select(v-model="currentSeason")
                  option(v-for="season in seasons") {{ season }}
</template>

<script>
import {
  selectedSeason,
  selectedRegion,
  seasons,
  regions
} from '../vuex/getters'

import {
  updateSelectedRegion,
  updateSelectedSeason
} from '../vuex/actions'

export default {
  vuex: {
    getters: {
      selectedSeason,
      selectedRegion,
      seasons,
      regions
    },
    actions: {
      updateSelectedSeason,
      updateSelectedRegion
    }
  },
  computed: {
    currentRegion: {
      get() {
        return this.regions[this.selectedRegion]
      },
      set(val) {
        this.updateSelectedRegion(this.regions.indexOf(val))
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
    // Start with the latest season
    this.updateSelectedSeason(this.seasons.length - 1)
  }
}
</script>
