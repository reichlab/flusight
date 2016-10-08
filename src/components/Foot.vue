<style lang="scss" scoped>
.footer {
    padding: 20px 20px 20px !important;
}
</style>

<template>
    <footer class="footer">
        <div class="container">
            <div class="content has-text-centered">
                <a v-bind:href="metadata.sourceUrl"><strong>flusight</strong></a> by <a v-bind:href="metadata.parentUrl">Reichlab</a>. The source code is licensed <a v-bind:href="metadata.licenseUrl">GPLv3</a>.
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
