<style lang="scss">

$accent: rgba(24, 129, 127, 0.901961);

.axis {
    font: 10px sans-serif;
}

.axis path,
.axis line {
    fill: none;
    stroke: #bbb;
    shape-rendering: geometricPrecision;
}

.actualline {
    fill: none;
    stroke: $accent;
    stroke-width: 1.5px;
}

circle.point {
    stroke: $accent;
    fill: $accent;
}

.overlay {
    fill: none;
    pointer-events: all;
}

.focus circle {
    fill: none;
    stroke: $accent;
}

.baseline {
    stroke: #353535;
    stroke-width: 0.5px;
    stroke-dasharray: 5, 5;
}

.timerect {
    fill: rgba(253, 245, 230, 0.59);
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
  import { setChart } from '../vuex/actions'

  export default {
    vuex: {
      getters: {
        chart,
        subData
      },
      actions: {
        setChart
      }
    },
    ready() {
      // Use d3 v4 (vue-d3)
      this.setChart(new Chart(this.$d3, 'chart'))
      this.chart.setup()
      this.chart.plotActual(this.subData)
    }
  }
</script>
