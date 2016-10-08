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
                                <span class="select is-medium">
                                    <select :value="selectedRegion" @change="updateRegion">
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
                                <span class="select is-medium">
                                    <select :value="selectedSeason" @change="updateSeason">
                                        <option v-for="season in seasons">
                                            {{ season }}
                                        </option>
                                    </select>
                                </span>
                            </p>
                        </div>
                        <div class="level-item">
                            <p class="heading">Prediction Model</p>
                            <p class="control title">
                                <span class="select is-medium">
                                    <select :value="selectedModel" @change="updateModel">
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
    updateModel,
    updateRegion,
    updateSeason
  } from '../vuex/actions'

  export default {
    vuex: {
      getters: {
        selectedRegion,
        selectedSeason,
        selectedModel,
        models,
        seasons,
        regions
      },
      actions: {
        updateSeason,
        updateModel,
        updateRegion
      }
    }
  }
</script>
