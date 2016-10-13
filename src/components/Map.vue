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
  import { map } from '../vuex/getters'
  import { setMap } from '../vuex/actions'

  export default {
    vuex: {
      getters: {
        map
      },
      actions: {
        setMap
      }
    },
    ready() {
      // Draw map
      this.setMap(new Map(this.$d3, 'map'))
    }
  }
</script>
