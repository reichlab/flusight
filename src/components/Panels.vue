<style lang="scss">
h1 {
    font-size: 20px;
    color: #00d1b2;
    font-family: "Fira Sans", Helvetica, sans-serif;
    .thick {
        font-family: "Open Sans Extrabold";
        color: #aaa;
        font-weight: bold;
    }
}

#map {
    position: relative;
    height: 325px;
}

path.mg-confidence-band {
    fill: #05b378 !important;
    opacity: 0.2 !important;
}

</style>

<template>
    <div class="columns">
        <div class="column is-one-third">
            <div id="map">
            </div>
        </div>
        <div class="column">
            <div id="chart">
            </div>
        </div>
    </div>
</template>

<script>
  import 'metrics-graphics'
  import 'topojson'
  import Datamap from 'datamaps/dist/datamaps.usa.js'

  export default {
    ready() {
      // Geneate random data
      var map = new Datamap({
        element: document.getElementById('map'),
        scope: 'usa',
        fills: {
          defaultFill: 'rgba(24, 128, 126, 0.9)'
        }
      });
      let data = [[], []]
      for (let i = 0; i < 50; i++) {
        data[0].push({'x': i, 'value': Math.random()})
      }

      for (let i = 15; i < 25; i++) {
        let val = data[0][i].value
        let ind = i - 15

        data[1].push({
          'x': i,
          'value': val + ind * 0.2,
          'lower': val + ind * 0.2 - ind * 0.1,
          'upper': val + ind * 0.2 + ind * 0.1
        })
      }

      MG.data_graphic({
        title: "Sample Chart",
        description: "Sample plot",
        data: data,
        full_width: true,
        height: 300,
        right: 50,
        target: '#chart',
        x_accessor: 'x',
        y_accessor: 'value',
        show_tooltips: false,
        missing_is_hidden: true,
        area: false,
        baselines: [{'value': 0.3, 'label': "A horizontal marker"}],
        markers: [{'x': 14, 'label': 'A vertical marker'}],
        legend: ['Actual','Predictions'],
        show_confidence_band: ['lower', 'upper'],
        animate_on_load: true,
        aggregate_rollover: true
      })
    }
  }
</script>
