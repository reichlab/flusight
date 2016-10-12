<style lang="scss" scoped>
#map {
    position: relative;
    height: 325px;
}
</style>

<template>
    <div class="column is-one-third">
        <div id="map">
        </div>
    </div>
</template>

<script>
  import 'topojson'
  import Datamap from 'datamaps/dist/datamaps.usa.js'

  export default {
    ready() {
      const d3 = this.$d3
      // Draw map
      let map = new Datamap({
        element: document.getElementById('map'),
        scope: 'usa',
        setProjection: (element, options) => {
          let projection = d3.geoAlbersUsa()
              .scale(500)
              .translate([element.offsetWidth / 2, element.offsetHeight / 2])
          return {
            path: d3.geoPath().projection(projection),
            projection: projection
          }
        },
        fills: {
          defaultFill: 'rgba(24, 128, 126, 0.9)'
        },
        geographyConfig: {
          highlightOnHover: false,
          popupTemplate: (geo, data) => {
            return ['<div class="hoverinfo">',
                    '<strong>Region</strong><br>',
                    'Weighted ILI (%): 0',
                    '</div>'].join('');
          }
        }
      });
    }
  }
</script>
