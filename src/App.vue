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

#info-tooltip {
    z-index: 100;
    position: fixed;
    box-shadow: 0px 0px 2px;
    border-radius: 1px;
    padding: 5px 10px;
    color: #333;
    font-size: 11px;
    background-color: white;
    width: 150px;

    .bold {
        font-weight: bold;
    }
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

.section {
    padding: 30px 20px !important;
}
</style>

<template>

    <div id="info-tooltip"></div>

    <div id="loader"></div>

    <intro></intro>

    <navbar></navbar>

    <selectors></selectors>

    <div class="section">
        <div id="app" class="container">
            <panels></panels>
        </div>
    </div>

    <foot></foot>
</template>

<script>
  import Navbar from './components/Navbar'
  import Intro from './components/Intro'
  import Panels from './components/Panels'
  import Selectors from './components/Selectors'
  import Foot from './components/Foot'
  import store from './vuex/store'
  import { forward, backward, appendIntroItems } from './vuex/actions'
  import { metadata } from './vuex/getters'

  var $ = window.jQuery = require('jquery')
  require('./assets/fakeLoader.min.js')

  export default {
    components: {
      Navbar,
      Intro,
      Panels,
      Selectors,
      Foot
    },
    vuex: {
      actions: {
        backward,
        forward,
        appendIntroItems
      },
      getters: {
        metadata
      }
    },
    store,
    ready() {

      $('#loader').fakeLoader({
        spinner: 'spinner1',
        bgColor: '#268bd2'
      })

      $('#info-tooltip').css('display', 'none')

      window.addEventListener('keyup', (evt) => {
        if (evt.code === 'ArrowRight') {
          this.forward()
        } else if (evt.code === 'ArrowLeft') {
          this.backward()
        }
      })

      // Append intro items
      this.appendIntroItems([
        {
          title: 'Region and Season',
          content: `Select the HHS region and flu season`,
          direction: 'left',
          element: '#main-selectors'
        },
        {
          title: 'Predictions',
          content: `<p>Predictions are shown in this panel. You can use your
      keyboard's arrow keys or mouse to move around through weeks.</p>
      <br><p>Hover over the chart to know more about the displayed lines and
      points.</p>`,
          direction: 'left',
          element: '#timechart-container'
        },
        {
          title: 'Legend',
          content: `Available prediction models are shown in this legend. You
      can toggle marker display from here.`,
          direction: 'left',
          element: '#legend'
        },
        {
          title: 'Other controls',
          content: `Other chart controls are here. Hover over to know more.`,
          direction: 'left',
          element: '#nav-controls'
        },
        {
          title: 'Choropleth',
          content: `<p>This panel shows a map with data for the currently
      selected week.</p><p>It also doubles up as a region selector</p>`,
          direction: 'right',
          element: '#choropleth-container'
        },
        {
          title: 'Choropleth data',
          content: `Data to be displayed on map can be selected here`,
          direction: 'right',
          element: '#choropleth-selector'
        },
        {
          title: 'Finished',
          content: `Checkout the source and file any issue you have on the
      project's github page <a href="` + this.metadata.sourceUrl + `">here</a>.`,
          direction: 'left',
          element: ''
        }
      ])
    }
  }
</script>
