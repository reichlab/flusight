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
            span#season-selector.select.is-small
              select(v-model="currentSeason")
                option(v-for="season in seasons") {{ season }}


// Main plotting div
#choropleth
  #relative-button
    span.icon
      i(
        v-bind:class=`[choroplethRelative ? 'fa-toggle-on' : 'fa-toggle-off',
                      'fa']`
        v-on:click="toggleRelative"
       )
    span Show relative values
</template>

<script>
import Choropleth from '../../modules/choropleth'
import {
  initChoropleth,
  updateSelectedRegion,
  updateSelectedSeason,
  plotChoropleth,
  updateChoropleth,
  toggleRelative
} from '../../vuex/actions'
import {
  selectedWeekName,
  selectedSeason,
  selectedRegion,
  choroplethRelative,
  seasons,
  regions
} from '../../vuex/getters'

export default {
  vuex: {
    actions: {
      initChoropleth,
      updateSelectedRegion,
      updateSelectedSeason,
      plotChoropleth,
      updateChoropleth,
      toggleRelative
    },
    getters: {
      selectedWeekName,
      selectedSeason,
      selectedRegion,
      choroplethRelative,
      seasons,
      regions
    }
  },
  computed: {
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

    let d3 = this.$d3
    let infoTooltip = d3.select('#info-tooltip')

    // Info tooltip
    d3.select('#relative-button')
      .on('mouseover', function() {
        infoTooltip
          .style('display', null)
      })
      .on('mouseout', function() {
        infoTooltip
          .style('display', 'none')
      })
      .on('mousemove', function() {
        infoTooltip
          .style('top', (d3.event.pageY + 20) + 'px')
          .style('left', (d3.event.pageX + 20) + 'px')
          .html(`Show relative weighted ILI values in map as percentage
                 above/below the regional CDC baseline`)
      })
  }
}
</script>
