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
  ul {
    list-style: disc inside none;
    display: table;

    li {
      display: table-row;
      &::before {
        content: '•';
        display: table-cell;
        text-align: right;
        padding-right: 10px;
      }
    }
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

  &#panel-section {
    padding-bottom: 10px !important;
  }
}

</style>

<template lang="pug">
// Fixed position components
#info-tooltip
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
        title: 'Season',
        content: `Use this pull-down menu to select the flu season`,
        direction: 'right',
        element: '#season-selector'
      },
      {
        title: 'Predictions',
        content: `<p>You can use your keyboard's arrow keys or mouse to move
                  between weeks for which we have data and predictions.</p>
                  <br><p>The "current week" is the leading edge of the grey
                  shaded region: the predictions shown were made when that
                  week's data became available.</p><br><p>A forecast for the
                  next four weeks is shown, as is the time and height of the
                  peak week and the time of season onset.</p>`,
        direction: 'left',
        element: '#timechart-container'
      },
      {
        title: 'Legend',
        content: `You can interact with the legend to display different
                  combinations of models, or to toggle the historical data
                  lines and change confidence interval. Click on the links
                  next to the models for more information about the models
                  themselves.`,
        direction: 'left',
        element: '#legend'
      },
      {
        title: 'Other controls',
        content: `You can use these buttons to hide the legend, or move the
                  graph forward or backward in time.`,
        direction: 'left',
        element: '#nav-controls'
      },
      {
        title: 'US Map',
        content: `<p>The map shows data for the currently selected week.</p>
                  <p>You can also click on the map to see predictions for a
                  particular region.</p>`,
        direction: 'right',
        element: '#map-intro'
      },
      {
        title: 'Finished',
        content: `Check out the source for this app and provide feedback on
                  the project's github page <a href="` +
                  this.metadata.sourceUrl + `" target="_blank">here</a>.`,
        direction: 'left',
        element: ''
      }
    ])
  }
}
</script>
