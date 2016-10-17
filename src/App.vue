<style lang="scss">

$accent: rgb(24, 128, 126);

::selection {
    background: $accent;
    color: white;
}

::-moz-selection {
    background: $accent;
    color: white;
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

  var $ = window.jQuery = require('jquery')
  require('./assets/fakeLoader.min.js')

  export default {
    components: {
      Navbar,
      Panels,
      Selectors,
      Foot
    },
    store,
    ready() {
      $("#fakeLoader").fakeLoader({
        spinner:"spinner6",
        bgColor:"#18807e"
      })
    }
  }
</script>
