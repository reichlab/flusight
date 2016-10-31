<style lang="scss">

$accent: rgb(24, 129, 127);

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
        stroke-width: 10px;
    }
}

// Peak markers
.peak-group {
    .peak-mark {
        stroke-width: 10px;
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
        opacity: 0.3;
    }
}

// Actual data
.actual-group {
    pointer-events: none;
    .line-actual {
        fill: none;
        stroke: $accent;
        stroke-width: 1.5px;
        opacity: 0.4;
    }

    .point-actual {
        stroke: $accent;
        fill: $accent;
        opacity: 0.7;
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
        color: white;

        &.head {
            color: #333;
        }
    }
}

#nav-controls {
    position: absolute;
    right: 0px;
    top: 20px;
    .icon {
        margin-left: 0px !important;
    }
    a {
        box-shadow: 1px 1px 1px #ccc;
        margin: 2px 0px;
        &.legend-btn {
            border-width: 1px;
            border-color: #3273dc;
        }
    }
}

#legend {
    position: absolute;
    right: 60px;
    top: 30px;
    width: 100px;
    height: 200px;
    box-shadow: 1px 1px 2px #ccc;
    background-color: white;
    border-radius: 1px;
}

</style>

<template>
    <div id="timechart">
    </div>
    <div id="legend" v-show="show">
    </div>
    <div id="nav-controls">
        <a class="button is-small is-info legend-btn" v-on:click="toggle" v-bind:class="[show ? 'is-outlined' : '']">
            <span class="icon is-small">
                <i class="fa fa-map-o"></i>
            </span>
        </a>
        <br>
        <a class="button is-small is-outlined is-info" v-on:click="backward">
            <span class="icon is-small">
                <i class="fa fa-arrow-left"></i>
            </span>
        </a>
        <br>
        <a class="button is-small is-outlined is-info" v-on:click="forward">
            <span class="icon is-small">
                <i class="fa fa-arrow-right"></i>
            </span>
        </a>
    </div>
</template>

<script>
  import TimeChart from '../../modules/timechart'
  import {
    initTimeChart,
    updateSelectedWeek,
    plotTimeChart,
    updateTimeChart,
    backward,
    forward
  } from '../../vuex/actions'

  export default {
    data() {
      return {
        show: false
      }
    },
    methods: {
      toggle() {
        this.show = !this.show
      }
    },
    vuex: {
      actions: {
        initTimeChart,
        updateSelectedWeek,
        plotTimeChart,
        updateTimeChart,
        backward,
        forward
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
    }
  }
</script>
