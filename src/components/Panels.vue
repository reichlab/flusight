<style lang="scss" scoped>
</style>

<template>
    <div class="columns">
        <map></map>
        <chart></chart>
    </div>
</template>

<script>
  import Chart from './Chart'
  import Map from './Map'

  export default {
    components: {
      Chart,
      Map
    }
  }
</script>
