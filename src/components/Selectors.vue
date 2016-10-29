<style lang="scss" scoped>
.hero-body {
    padding-bottom: 20px;
    padding-top: 20px;
}

.chart-nav-btn {
    .icon {
        margin-left: 0px !important;
        color: white;
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
                                Real-time Influenza Forecasts
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
                                <span class="select">
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
                                <span class="select">
                                    <select v-model="currentSeason">
                                        <option v-for="season in seasons">
                                            {{ season }}
                                        </option>
                                    </select>
                                </span>
                            </p>
                        </div>
                        <div class="level-item">
                            <p class="heading">Navigate</p>
                            <p class="control title">
                                <a class="button is-primary chart-nav-btn" v-on:click="backward">
                                    <span class="icon">
                                        <i class="fa fa-arrow-left"></i>
                                    </span>
                                </a>
                                <a class="button is-primary chart-nav-btn" v-on:click="forward">
                                    <span class="icon">
                                        <i class="fa fa-arrow-right"></i>
                                    </span>
                                </a>
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
    updateSelectedSeason,
    backward,
    forward
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
        updateSelectedRegion,
        backward,
        forward
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
