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

    .bold {
        font-weight: bold;
    }
}
</style>

<template>

    <div id="info-tooltip"></div>

    <div id="fakeLoader"></div>

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
  import Panels from './components/Panels'
  import Selectors from './components/Selectors'
  import Foot from './components/Foot'
  import store from './vuex/store'
  import { forward, backward } from './vuex/actions'

  var $ = window.jQuery = require('jquery')
  require('./assets/fakeLoader.min.js')

  export default {
    components: {
      Navbar,
      Panels,
      Selectors,
      Foot
    },
    vuex: {
      actions: {
        backward,
        forward
      }
    },
    store,
    ready() {
      $('#fakeLoader').fakeLoader({
        spinner: 'spinner6',
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
    }
  }
</script>
