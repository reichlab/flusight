<style lang="scss" scoped>
.brand {
    font-size: 20px;
    color: #00d1b2;
    .thick {
        font-family: "Open Sans Extrabold";
        color: #aaa;
        font-weight: bold;
    }
}
</style>

<template>
    <nav class="nav has-shadow">
        <div class="nav-left">
            <a class="nav-item is-brand" href="#">
                <span class="brand title"><i class="fa fa-bar-chart"></i> {{ metadata.title }} | <span class="thick">{{ metadata.parent }}</span></span>
            </a>
        </div>

        <span class="nav-toggle">
            <span></span>
            <span></span>
            <span></span>
        </span>

        <div class="nav-right nav-menu">
            <span class="nav-item">
                <a class="button is-small is-info">
                    <span class="icon is-small">
                        <i class="fa fa-question"></i>
                    </span>
                    <span>Help</span>
                </a>
                <a class="button is-dark is-small" v-bind:href="metadata.sourceUrl">
                   <span class="icon is-small">
                       <i class="fa fa-github"></i>
                   </span>
                   <span>Source</span>
               </a>
           </span>
       </div>
   </nav>
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
