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
      // Draw random map
      let map = new Datamap({
        element: document.getElementById('map'),
        scope: 'usa',
        fills: {
          defaultFill: 'rgba(24, 128, 126, 0.9)'
        },
        geographyConfig: {
          highlightOnHover: false,
          popupTemplate: (geo, data) => {
            return ['<div class="hoverinfo"><strong>',
                    '' + geo.id,
                    '</strong></div>'].join('');
          }
        }
      });
    }
  }
</script>
