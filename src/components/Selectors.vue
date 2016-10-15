<style lang="scss" scoped>
.hero-body {
    padding-bottom: 20px;
    padding-top: 20px;
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
                                Influenza Forecast
                            </h1>
                            <h2 class="subtitle">
                                Some descriptory subtitle
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
                            <p class="heading">Model</p>
                            <p class="control title">
                                <span class="select">
                                    <select v-model="currentModel">
                                        <option v-for="model in models">
                                            {{ model }}
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
    selectedModel,
    selectedSeason,
    selectedRegion,
    models,
    seasons,
    regions
  } from '../vuex/getters'
  import {
    updateSelectedModel,
    updateSelectedRegion,
    updateSelectedSeason
  } from '../vuex/actions'

  export default {
    vuex: {
      getters: {
        selectedModel,
        selectedSeason,
        selectedRegion,
        models,
        seasons,
        regions
      },
      actions: {
        updateSelectedSeason,
        updateSelectedModel,
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
      },
      currentModel: {
        get() {
          return this.models[this.selectedModel]
        },
        set(val) {
          this.updateSelectedModel(this.models.indexOf(val))
        }
      }
    }
  }
</script>
