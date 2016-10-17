<style lang="scss">

$accent: rgba(24, 129, 127, 0.901961);

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
        fill: rgba(52, 152, 219, 1.0);
        stroke: rgba(52, 152, 219, 0.5);
        stroke-width: 6px;
    }
}

// Peak markers
.peak-group {
    .peak-mark {
        fill: rgba(243, 156, 18, 9.0);
        stroke: rgba(243, 156, 18, 0.5);
        stroke-width: 10;
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

.baseline {
    stroke: #353535;
    stroke-width: 0.5px;
    stroke-dasharray: 5, 5;
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
    <div class="column">
        <div id="chart">
        </div>
    </div>
</template>

<script>
  import Chart from '../chart'
  import { chart, subData } from '../vuex/getters'
  import { setChart, stepForward, stepBackward } from '../vuex/actions'

  export default {
    vuex: {
      getters: {
        chart,
        subData
      },
      actions: {
        setChart,
        stepBackward,
        stepForward
      }
    },
    ready() {
      // Use d3 v4 (vue-d3)
      this.setChart(new Chart(this.$d3, 'chart'))
      this.chart.setup()
      this.chart.plotActual(this.subData)
      this.stepForward()

      window.addEventListener('keyup', (evt) => {
        if (evt.code === 'ArrowRight') {
          this.stepForward()
        } else if (evt.code === 'ArrowLeft') {
          this.stepBackward()
        }
      })
    }
  }
</script>
