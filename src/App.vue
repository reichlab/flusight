<style lang="scss">

$accent: #268bd2;

::selection {
  background: $accent;
  color: white;
}

::-moz-selection {
  background: $accent;
  color: white;
}

svg text::selection {
  fill: white;
}

body {
  background-color: white;
}

#loader {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background-color: $accent;
  z-index: 999;
}

.tooltip {
  position: fixed;
  z-index: 100;
  box-shadow: 0px 0px 2px;
  border-radius: 1px;
  background-color: white;
  font-size: 11px;
  .bold {
    font-weight: bold;
  }
}

.section {
  padding: 30px 20px !important;

  &#panel-section {
    padding-bottom: 10px !important;
  }
}

</style>

<template lang="pug">
div
  // Fixed position components
  #loader
  intro

  // Main layout components
  navbar
  .section#panel-section
    #app.container
      panels
  foot
</template>

<script>
import Navbar from './components/Navbar'
import Intro from './components/Intro'
import Panels from './components/Panels'
import Foot from './components/Foot'

import { mapGetters, mapActions } from 'vuex'

var $ = window.jQuery = require('jquery')
require('./assets/fakeLoader.min.js')

export default {
  components: {
    Navbar,
    Intro,
    Panels,
    Foot
  },
  computed: {
    ...mapGetters(['branding'])
  },
  methods: {
    ...mapActions('weeks', [
      'backwardSelectedWeek',
      'forwardSelectedWeek'
    ])
  },
  head: {
    title: function () {
      return {
        inner: this.branding.title,
        complement: this.branding.parent
      }
    },
    meta: function () {
      return [
        { name: 'application-name', content: this.branding.title },
        { name: 'description', content: this.branding.description },
        // Twitter
        { name: 'twitter:title', content: this.branding.title },
        { name: 'twitter:description', content: this.branding.description },
        { name: 'twitter:image', content: this.branding.imageUrl },
        { name: 'twitter:url', content: this.branding.appUrl },
        // Google+ / Schema.org
        { itemprop: 'name', content: this.branding.title },
        { itemprop: 'description', content: this.branding.description },
        { itemprop: 'image', content: this.branding.imageUrl },
        // Open Graph
        { property: 'og:title', content: this.branding.title },
        { property: 'og:description', content: this.branding.description },
        { property: 'og:image', content: this.branding.imageUrl },
        { property: 'og:url', content: this.branding.appUrl }
      ]
    }
  },
  ready () {
    $('#loader').fakeLoader({
      spinner: 'spinner1',
      bgColor: '#268bd2'
    })

    window.addEventListener('keyup', evt => {
      if (evt.code === 'ArrowRight') {
        this.forwardSelectedWeek()
      } else if (evt.code === 'ArrowLeft') {
        this.backwardSelectedWeek()
      }
    })
  }
}
</script>
