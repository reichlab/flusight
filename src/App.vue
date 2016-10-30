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
</style>

<template>

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
      $("#fakeLoader").fakeLoader({
        spinner:"spinner6",
        bgColor:"#268bd2"
      })

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
