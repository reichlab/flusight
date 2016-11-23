<style lang="scss">

// Palette
$observed: rgb(24, 129, 127);
$actual: #66d600;
$accent: #3273dc;

// Mouse overlay
.overlay {
  fill: none;
  pointer-events: all;
  cursor: pointer;
}

.hover-line {
  fill: none;
  stroke: #bbb;
  stroke-width: 1px;
}

// Axes styles
.axis {
  path, line {
    fill: none;
    stroke: #bbb;
    shape-rendering: geometricPrecision;
  }

  .title {
    fill: #444;
    font: 10px sans-serif;
  }
}

// Onset markers
.onset-group {
  .onset-mark {
      stroke-width: 6px;
  }
}

.onset-paint {
  fill: white;
}

// Peak markers
.peak-group {
  .peak-mark {
    stroke-width: 10px;
    opacity: 0.9;
    &:hover {
      opacity: 1.0;
    }
  }
  .range {
    stroke-width: 0.5px;
    stroke-dasharray: 5, 5;
  }
}

// Prediction area, line and dots
.prediction-group {
  pointer-events: none;
  .line-prediction {
    fill: none;
    stroke-width: 1.5px;
  }
  .point-prediction {
    fill: white;
    stroke-width: 1.5px;
  }
  .area-prediction {
    opacity: 0.2;
  }
}

// Observed line and dots
.observed-group {
  pointer-events: none;
  .line-observed {
    fill: none;
    stroke: $observed;
    stroke-width: 1.5px;
    opacity: 0.4;
  }
  .point-observed {
    stroke: $observed;
    fill: $observed;
    opacity: 0.7;
  }
}

// Actual data
.actual-group {
  pointer-events: none;
  .line-actual {
    fill: none;
    stroke: $actual;
    stroke-width: 2.5px;
    opacity: 0.4;
  }
  .point-actual {
    stroke: $actual;
    fill: $actual;
    opacity: 0.4;
  }
}

.baseline-group {
  .baseline {
    stroke: #353535;
    stroke-width: 0.5px;
    stroke-dasharray: 5, 5;
  }
  .title {
    fill: #444;
    font-size: 10px;
  }
}

.timerect {
  fill: rgb(245, 245, 245);
}

.range, .stopper {
  stroke: rgba(100, 100, 100, 0.6);
  stroke-width: 1px;
}

#chart-tooltip {
  z-index: 100;
  position: fixed;
  box-shadow: 0px 0px 2px;
  border-radius: 1px;
  background-color: white;
  font-size: 11px;
  .bold {
    font-weight: bold;
    float: right;
    margin-left: 5px;
  }
  .actual {
    padding: 5px 10px;
    color: #333;
  }
  .prediction {
    padding: 5px 10px;
    color: white;
  }
  .point {
    padding: 5px 10px;
    color: #333;
    &.head {
      color: white;
    }
  }
}

#legend-tooltip {
  z-index: 100;
  position: fixed;
  box-shadow: 0px 0px 2px;
  border-radius: 1px;
  background-color: white;
  font-size: 11px;
  width: 150px;
  .name {
    padding: 5px 10px;
    font-size: 13px;
  }
  .desc {
    margin-top: 0px;
    padding: 5px 10px;
  }
}

#nav-controls {
  position: absolute;
  background-color: white;
  right: 10px;
  top: 10px;
  .icon {
    margin-left: 0px !important;
  }
  a {
    box-shadow: 1px 1px 1px #ccc;
    margin: 2px 0px;
    width: 28px;
    &.legend-btn {
      border-width: 1px;
      border-color: $accent;
    }
  }
}

.history-group {
  .line-history {
    fill: none;
    stroke-width: 2px;
    stroke: #eee;
    &.highlight {
      stroke: #ddd;
      stroke-width: 3px;
      pointer-events: none;
    }
  }
}

.nav-drawer {
  user-select: none;
  position: absolute;
  right: 60px;
  top: 12px;
  box-shadow: 1px 1px 2px #ccc;
  background-color: white;
  border-radius: 2px;
  border-style: solid;
  border-width: 1px;
  border-color: #ccc;
  font-size: 11px;
  hr {
    height: 1px;
    margin: 5px 0;
    border: 0;
    border-bottom: 1px dashed rgb(204, 204, 204);
    background: rgba(153, 153, 153, 0);
  }
  .item {
    padding: 4px 10px;
    .fa {
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
    }
    .item-title {
      font-size: 11px;
      display: inline-block;
      vertical-align: middle;
    }
    .model-url {
      margin-right: 5px;
      margin-left: 10px;
    }
    &.na {
      .fa {
        color: #aaa !important;
      }
      color: #aaa !important;
    }
  }
  .item-selected {
      background-color: $accent;
      color: white;
  }
  #legend-ci-container {
    text-align: center;
    #legend-ci-buttons {
      margin-left: 10px;
      border-style: solid;
      border-width: 1px;
      border-color: #ccc;
      border-radius: 2px;
      padding: 2px 0px;
      .ci-button {
        padding: 2px 6px;
        &.selected {
          background-color: $accent;
          color: white;
        }
        &:first-child {
          border-top-left-radius: 2px;
          border-bottom-left-radius: 2px;
        }
        &:last-child {
          border-top-right-radius: 2px;
          border-bottom-right-radius: 2px;
        }
      }
    }
  }
}

#no-pred {
  position: absolute;
  top: 60px;
  left: 70px;
  line-height: 25px;
}

</style>

<template lang="pug">
// Tooltips
#legend-tooltip
#chart-tooltip

// No predictions text
#no-pred.heading Predictions not available <br> for current week

// Main plotting div
#timechart

// Legend
#legend.nav-drawer(v-show="legendShow")
  #legend-actual-container
  hr
  #legend-ci-container
    .item
      span CI
      span#legend-ci-buttons
  hr
  #legend-prediction-container

// Controls
#nav-controls
  a.button.is-small.is-info.legend-btn(
    v-on:click="toggleLegend"
    v-bind:class="[legendShow ? '' : 'is-outlined']"
  )
    span.icon.is-small
      i.fa.fa-map-o
  br
  a#backward-btn.button.is-small.is-outlined.is-info(v-on:click="backward")
    span.icon.is-small
      i.fa.fa-arrow-left
  br
  a#forward-btn.button.is-small.is-outlined.is-info(v-on:click="forward")
    span.icon.is-small
      i.fa.fa-arrow-right
</template>

<script>
import TimeChart from '../../modules/timechart'
import { legendShow } from '../../vuex/getters'
import {
  initTimeChart,
  updateSelectedWeek,
  plotTimeChart,
  updateTimeChart,
  backward,
  forward,
  toggleLegend
} from '../../vuex/actions'

export default {
  vuex: {
    actions: {
      initTimeChart,
      updateSelectedWeek,
      plotTimeChart,
      updateTimeChart,
      backward,
      forward,
      toggleLegend
    },
    getters: {
      legendShow
    }
  },
  ready() {
    // Initialize time chart
    this.initTimeChart(new TimeChart(this.$d3, 'timechart', (weekData) => {
      this.updateSelectedWeek(weekData)
    }))

    // Setup selected data
    this.plotTimeChart()

    // Hot start
    this.updateTimeChart()

    // Add tooltips to nav icons
    let d3 = this.$d3
    let tooltip = d3.select('#info-tooltip')

    let elems = [
      ['.legend-btn', 'Toggle legend'],
      ['#forward-btn', 'Move forward'],
      ['#backward-btn', 'Move backward']
    ]

    elems.map(e => d3.select(e[0])
              .on('mouseover', () => tooltip.style('display', null).style('width', '100px'))
              .on('mouseout', () => tooltip.style('display', 'none').style('width', null))
              .on('mousemove', () => {
                tooltip
                  .style('top', d3.event.pageY + 'px')
                  .style('left', (d3.event.pageX - 100 - 20) + 'px')
                  .html(e[1])
              }))
  }
}
</script>
