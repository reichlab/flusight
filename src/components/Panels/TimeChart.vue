<style lang="scss">

$accent: rgba(24, 129, 127, 0.901961);

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
        fill: white;
        stroke: $accent;
        stroke-width: 1.5px;
    }
}

// Peak markers
.peak-group {
    .peak-mark {
        fill: white;
        stroke: $accent;
        stroke-width: 1.5px;
    }
    .range {
        stroke-width: 0.5px;
        stroke-dasharray: 5, 5;
    }
}

// Prediction area, line and dots
.prediction-group {
    .area-prediction {
        fill: rgba(43, 131, 186, 0.4);
    }

    .line-prediction {
        fill: none;
        stroke: rgba(43, 131, 186, 1.0);
        stroke-width: 1.5px;
    }

    .point-prediction {
        stroke: rgba(43, 131, 186, 1.0);
        fill: white;
        stroke-width: 1.5px;
    }
}

// Actual data
.actual-group {
    .line-actual {
        fill: none;
        stroke: $accent;
        stroke-width: 1.5px;
        opacity: 0.7;
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
    fill: rgba(253, 245, 230, 0.59);
}

.range, .stopper {
    stroke: rgba(100, 100, 100, 0.6);
    stroke-width: 1px;
}

</style>

<template>
    <div id="timechart">
    </div>
</template>

<script>
  import TimeChart from '../../modules/timechart'
  import {
    initTimeChart,
    updateSelectedWeek,
    plotTimeChart,
    updateTimeChart
  } from '../../vuex/actions'

  export default {
    vuex: {
      actions: {
        initTimeChart,
        updateSelectedWeek,
        plotTimeChart,
        updateTimeChart
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
