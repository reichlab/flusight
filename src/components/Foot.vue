<style lang="scss" scoped>
.footer {
    padding: 20px 20px 20px !important;
    font-weight: 100;
}
</style>

<template>
    <footer class="footer">
        <div class="container">
            <div class="content has-text-centered">
                 Data last updated on <strong>{{ metadata.updateTime }} (UTC)</strong>. The <a v-bind:href="metadata.sourceUrl">source</a> is licensed <a v-bind:href="metadata.licenseUrl">GPLv3</a>.
           </div>
        </div>
    </footer>
</template>

<script>
  import { metadata } from '../vuex/getters'

  export default {
    vuex: {
      getters: {
        metadata
      }
    }
  }
</script>
