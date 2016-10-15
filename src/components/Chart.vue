<style lang="scss">
.axis {
    font: 10px sans-serif;
}

.axis path,
.axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
}

.line {
    fill: none;
    stroke: steelblue;
    stroke-width: 1.5px;
}

circle.point {
    stroke: steelblue;
    fill: steelblue;
}

.overlay {
    fill: none;
    pointer-events: all;
}

.focus circle {
    fill: none;
    stroke: steelblue;
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
  import { chart } from '../vuex/getters'
  import { setChart } from '../vuex/actions'

  export default {
    vuex: {
      getters: {
        chart
      },
      actions: {
        setChart
      }
    },
    ready() {
      // Use d3 v4 (vue-d3)
      this.setChart(new Chart(this.$d3, 'chart'))
      this.chart.setup()
      this.chart.makeInteractive()
    }
  }
</script>
