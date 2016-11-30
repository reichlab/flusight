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

nav.nav {
    box-shadow: 0px 5px 30px -20px;
}

</style>

<template lang="pug">
.hero-head
  .container
    nav.nav
      // Logo
      .nav-left
        span.nav-item.is-brand
          span.brand.title
            a.brand-link(href="#")
              i.fa.fa-bar-chart
              |  {{ metadata.title }}
            |  |
            a.thick.brand-link(
              v-bind:href="metadata.parentUrl"
              target="_blank"
            )
              |  {{ metadata.parent }}

      // Right side buttons
      #nav-menu.nav-right.nav-menu
        span.nav-item
          a.button.is-small(v-on:click="moveIntroStart")
            span.icon.is-small
              i.fa.fa-question
            span Help

          a.button.is-info.is-small(v-bind:href="tweetBody", target="_blank")
            span.icon.is-small
              i.fa.fa-twitter
            span Tweet

          a.button.is-dark.is-small(
            v-bind:href="metadata.sourceUrl"
            target="_blank"
          )
            span.icon.is-small
              i.fa.fa-github
            span Source
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
  },
  data() {
    let tweetBody = 'https://twitter.com/intent/tweet?text=Flusight.%20'
    + 'Real-time%20Influenza%20Forecasts.%20https%3A%2F%2Freichlab'
    + '.github.io%2Fflusight%2F%20%40reichlab&source=webclient'
    return {
      tweetBody
    }
  }
}
</script>
