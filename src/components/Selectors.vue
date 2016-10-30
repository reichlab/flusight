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
}
</style>

<template>
    <section class="hero is-light">
        <div class="hero-body">
            <div class="container">
                <nav class="level">
                    <div class="level-left">
                        <div class="container">
                            <h1 class="title">
                                Real-time <span class="bold">Influenza Forecasts</span>
                            </h1>
                            <h2 class="subtitle">
                                CDC FluSight Challenge
                            </h2>
                        </div>
                    </div>
                    <div class="level-right box">
                        <div class="level-item">
                            <p class="heading">Region</p>
                            <p class="control title">
                                <span class="select is-small">
                                    <select v-model="currentRegion">
                                        <option v-for="region in regions">
                                            {{ region }}
                                        </option>
                                    </select>
                                </span>
                            </p>
                        </div>
                        <div class="level-item">
                            <p class="heading">Season</p>
                            <p class="control title">
                                <span class="select is-small">
                                    <select v-model="currentSeason">
                                        <option v-for="season in seasons">
                                            {{ season }}
                                        </option>
                                    </select>
                                </span>
                            </p>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    </section>
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
    }
  }
</script>
