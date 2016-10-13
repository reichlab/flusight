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
  import Map from '../map'

  export default {
    ready() {
      // Draw map
      let choropleth = new Map(this.$d3, 'map')
    }
  }
</script>
