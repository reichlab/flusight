<style lang="scss" scoped>

@import url('https://fonts.googleapis.com/css?family=Open+Sans:800');

.brand {
    font-size: 20px;
    color: #72caf9;
    .thick {
        font-family: "Open Sans";
        color: #aaa;
        font-weight: 800;
    }
}
</style>

<template>
    <div class="hero-head">
    <div class="container">
      <nav class="nav">
        <div class="nav-left">
            <a class="nav-item is-brand" href="#">
                <span class="brand title"><i class="fa fa-bar-chart"></i> {{ metadata.title }} | <span class="thick">{{ metadata.parent }}</span></span>
            </a>
        </div>

  <span id="nav-toggle" class="nav-toggle">
    <span></span>
    <span></span>
    <span></span>
  </span>

  <div id="nav-menu" class="nav-right nav-menu">
      <span class="nav-item">
        <a class="button is-small">
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

    </div>
  </div>
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
