<style lang="scss" scoped>

@import url('https://fonts.googleapis.com/css?family=Open+Sans:800');

.brand.title {
    font-size: 20px;
    color: #72caf9;

    .brand-link{
        color: #72caf9;
        &:hover {
            border: none;
        }
    }

    .thick {
        font-family: "Open Sans";
        color: #aaa;
        font-weight: 800;
        &:hover {
            color: #888;
        }
    }
}
</style>

<template>
    <div class="hero-head">
    <div class="container">
      <nav class="nav">
        <div class="nav-left">
            <span class="nav-item is-brand">
                <span class="brand title">
                    <a href="#" class="brand-link">
                        <i class="fa fa-bar-chart"></i> {{ metadata.title }}
                    </a>
                        |
                    <a class="thick brand-link" v-bind:href="metadata.parentUrl">
                        {{ metadata.parent }}
                </a>
            </span>
        </div>

  <div id="nav-menu" class="nav-right nav-menu">
      <span class="nav-item">
        <a class="button is-small" v-on:click="moveIntroStart">
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
  import { moveIntroStart } from '../vuex/actions'

  export default {
    vuex: {
      getters: {
        metadata
      },
      actions: {
        moveIntroStart
      }
    }
  }
</script>
