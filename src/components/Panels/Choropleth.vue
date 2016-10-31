<style lang="scss">
.datamaps-subunit {
    cursor: pointer;
}

#choropleth-info {
    position: absolute;
    top: 0px;
    left: 10px;
}

#week-number {
    font-size: 26px;
    color: #aaa;
    #number {
        color: #666;
        font-weight: bold;
    }
    margin-bottom: 5px;
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

<template>
    <div id="choropleth-info">
        <div id="week-number">
            Week <span id="number">{{ selectedWeekName }}</span>
        </div>
        <div class="control" id="choropleth-selector">
            <span class="select is-small">
                <select v-model="currentChoropleth">
                    <option v-for="choropleth in choropleths">
                        {{ choropleth }}
                    </option>
                </select>
            </span>
        </div>
    </div>
    <div id="choropleth">
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
