<style lang="scss">
.datamaps-subunit {
    cursor: pointer;
}

.info-group {
    .title {
        font-size: 15px;
    }
    .sub-title {
        font-size: 20px;
    }
    .switch {
        font-family: FontAwesome;
        font-size: 20px;
        cursor: pointer;
        fill: #ccc;
    }
}

#choropleth-head {
    padding: 4px 20px;
    margin-bottom: 20px;
    border-style: solid;
    border-width: 0px;
    border-left-width: 6px;
    border-color: #ccc;

    #week-number {
        font-size: 20px;
        margin-bottom: 6px;
    }
}
</style>

<template>
    <div id="choropleth-head">
        <p id="week-number">
            {{ selectedWeekName }}
        </p>
        <p class="control">
            <span class="select">
                <select v-model="currentChoropleth">
                    <option v-for="choropleth in choropleths">
                        {{ choropleth }}
                    </option>
                </select>
            </span>
        </p>
    </div>
    <div class="columns is-gapless">
        <div id="choropleth" class="column is-11">
        </div>
        <div id="color-bar" class="column is-1">
        </div>
    </div>
</template>

<script>
  import Choropleth from '../../modules/choropleth'
  import {
    initChoropleth,
    updateSelectedRegion,
    updateSelectedChoropleth,
    plotChoropleth,
    updateChoropleth
  } from '../../vuex/actions'
  import {
    selectedChoropleth,
    selectedWeekName,
    choropleths
  } from '../../vuex/getters'

  export default {
    vuex: {
      actions: {
        initChoropleth,
        updateSelectedRegion,
        updateSelectedChoropleth,
        plotChoropleth,
        updateChoropleth
      },
      getters: {
        selectedChoropleth,
        selectedWeekName,
        choropleths
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
