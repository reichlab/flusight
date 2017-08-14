<style lang="scss">

.datamaps-subunit {
  cursor: pointer;
}

#choropleth {
  text-align: center;

  #relative-button-title {
    padding-top: 10px;
    text-align: left;
    font-size: 12px;
  }

  #relative-button {
    position: absolute;
    text-align: left;
    font-size: 11px;
    cursor: pointer;
    user-select: none;
    .icon {
      margin: 0px 10px;
    }
    span {
      vertical-align: middle;
      &.disabled {
        color: #aaa;
      }
    }
  }
}

.colorbar-group .axis {
  line, path {
    fill: none;
    stroke: #bbb !important;
  }
}

#selectors {
  .level {
    margin-bottom: 0px;
  }
}

#switch-tooltip {
  padding: 5px 10px;
  ul {
    list-style: disc inside none;
    display: table;

    li {
      display: table-row;
      &::before {
        content: '•';
        display: table-cell;
        text-align: right;
        padding-right: 10px;
      }
    }
  }
}

#choropleth-tooltip {
  padding: 5px 10px;
  .value {
    font-size: 12px;
    font-weight: bold;
  }
}

#season-loading-spinner {
  img {
    width: 50px;
  }

  &.hidden {
    visibility: hidden;
  }
}
</style>

<template lang="pug">
div
  // Tooltip over relative toggle switch
  #switch-tooltip.tooltip(
    v-show="tooltips.switch.show"
    v-bind:style="tooltips.switch.pos"
  )
    | {{{ tooltips.switch.text }}}

  // Tooltip for map hover
  #choropleth-tooltip.tooltip
    .value
    .region

  #selectors
    .level.is-mobile
      .level-left
        .level-item
          .heading Week <b>{{ selectedWeekName }}</b>
          // .subtitle {{ regions[selectedRegion] }}
          span#region-selector.select
              select(v-model="currentRegion")
                option(v-for="region in regions") {{ region }}

      .level-right
        .level-item
          p.heading Season
            span#season-loading-spinner(v-bind:class="[seasonLoading ? '' : 'hidden']")
              img(v-bind:src="loadingSpinner")
          p.control.title
            span#season-selector.select.is-small
              select(v-model="currentSeason")
                option(v-for="season in seasons") {{ season }}


  // Main plotting div
  #choropleth
    #relative-button-title
      span Weighted ILI (%)
    #relative-button(
      v-on:click="toggleRelative"
      v-on:mouseover="showSwitchTooltip"
      v-on:mouseout="hideSwitchTooltip"
      v-on:mousemove="moveSwitchTooltip"
    )
      span(v-bind:class="[choroplethRelative ? 'disabled' : '']") Absolute
      span.icon
        i(
          v-bind:class=`[choroplethRelative ? '' : 'fa-rotate-180',
                        'fa fa-toggle-on']`
         )
      span(v-bind:class="[choroplethRelative ? '' : 'disabled']") Relative
</template>

<script>
import Choropleth from '../../modules/choropleth'
import { mapGetters, mapActions } from 'vuex'
import loadingSpinner from '../../assets/loading.gif'

export default {
  computed: {
    ...mapGetters([
      'seasons',
      'regions',
      'downloadedSeasons',
      'seasonDataUrls'
    ]),
    ...mapGetters('switches', [
      'selectedSeason',
      'selectedRegion',
      'choroplethRelative',
      'seasonLoading'
    ]),
    ...mapGetters('weeks', [
      'selectedWeekName'
    ]),
    currentSeason: {
      get () {
        return this.seasons[this.selectedSeason]
      },
      set (val) {
        // Check if we need to download the season
        if (this.downloadedSeasons.indexOf(val) === -1) {
          let dataUrl = this.seasonDataUrls[val]
          this.showSeasonLoading()
          this.$http.get(dataUrl).then(response => {
            let jsonText = response.bodyText.slice(17)
            if (jsonText.endsWith(';')) {
              jsonText = jsonText.slice(0, -1)
            }
            let data = JSON.parse(jsonText)
            this.addSeasonData(data)
            this.updateSelectedSeason(this.seasons.indexOf(val))
            this.hideSeasonLoading()
          }, response => {
            // TODO: Some way of notifying for error
            console.log('Some error')
            console.log(response)
            this.hideSeasonLoading()
          })
        } else {
          this.updateSelectedSeason(this.seasons.indexOf(val))
        }
      }
    },
    currentRegion: {
      get () {
        return this.regions[this.selectedRegion]
      },
      set (val) {
        this.updateSelectedRegion(this.regions.indexOf(val))
      }
    }
  },
  methods: {
    ...mapActions([
      'addSeasonData',
      'initMetadata',
      'initHistory',
      'initChoropleth',
      'plotChoropleth',
      'updateChoropleth',
      'initSeasonDataUrls'
    ]),
    ...mapActions('switches', [
      'updateSelectedRegion',
      'updateSelectedSeason',
      'toggleRelative',
      'hideSeasonLoading',
      'showSeasonLoading'
    ]),
    showSwitchTooltip () {
      this.tooltips.switch.show = true
    },
    hideSwitchTooltip () {
      this.tooltips.switch.show = false
    },
    moveSwitchTooltip (event) {
      let obj = this.tooltips.switch

      obj.pos.top = (event.clientY + 15) + 'px'
      obj.pos.left = (event.clientX + 15) + 'px'
    }
  },
  data () {
    return {
      tooltips: {
        switch: {
          show: false,
          text: `Choose between
                 <ul>
                 <li><b>Absolute</b> weighted ILI % values or</li>
                 <li><b>Relative</b> values as the percent above/below the<br>
                 regional CDC baseline
                 </ul>`,
          pos: {
            top: '0px',
            left: '0px'
          }
        }
      },
      loadingSpinner: loadingSpinner
    }
  },
  ready () {
    require.ensure(['../../store/data'], () => {
      let dataChunk = require('../../store/data')

      this.initSeasonDataUrls(dataChunk.seasonDataUrls)
      this.addSeasonData(dataChunk.latestSeasonData)
      this.initMetadata(dataChunk.metadata)
      this.initHistory(dataChunk.history)
      this.updateSelectedSeason(this.seasons.length - 1)

      // Setup map
      this.initChoropleth(new Choropleth('choropleth', regionId => {
        this.updateSelectedRegion(regionId)
      }))

      // Setup data
      this.plotChoropleth()

      // Hot start
      this.updateChoropleth()
    })
  }
}
</script>
