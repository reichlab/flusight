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
                <svg width="500" height="200">
                </svg>
            </div>
        </div>
    </div>
</template>

<script>
  import 'topojson'
  import Datamap from 'datamaps/dist/datamaps.usa.js'

  export default {
    ready() {
      // Geneate random data
      let map = new Datamap({
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
      let svg = d3.select('svg'),
          margin = {top: 20, right: 20, bottom: 20, left: 20},
          width = svg.attr('width') - margin.left - margin.right,
          height = svg.attr('height') - margin.top - margin.bottom,
          g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    }
  }
</script>
