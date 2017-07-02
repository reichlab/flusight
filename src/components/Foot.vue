<style lang="scss" scoped>
  
.footer {
  padding: 10px 20px !important;
  font-weight: 100;
  font-size: 13px;
  line-height: 20px;
  strong {
    color: #696969;
  }
}

</style>

<template lang="pug">
.modal#disclaimer-modal
  .modal-background
  .modal-card
    header.modal-card-head
      p.modal-card-title Disclaimer
      button.delete
    section.modal-card-body
      | This work has been supported by the Defense Advanced Research Projects Agency
      | Young Faculty Award (#D16AP00144) and by the National Institutes of General
      | Medical Sciences (R35GM119582). The content is solely the responsibility of
      | the authors and does not necessarily represent the official views of the DARPA,
      | the United States Department of Defense, NIGMS, or the National Institutes of Health.
    footer.modal-card-foot

footer.footer
  .container
    .content.has-text-centered
      | Data last updated on <strong>{{ updateTime }} (UTC)</strong>.
      br
      | Visualizations use <a href="https://github.com/d3/d3">D3</a>,
      | see the supported browsers
      | <a href="https://github.com/d3/d3/wiki#supported-environments">here</a>.
      | The <a v-bind:href="branding.sourceUrl">source</a> is licensed
      | <a href="https://opensource.org/licenses/MIT">MIT</a>.
      br
      | <a id="disclaimer-btn" href="#">Funding and disclaimer</a>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['branding', 'updateTime'])
  },
  ready () {
    let showModal = () => {
      document.getElementById('disclaimer-modal').className = 'modal is-active'
    }

    let hideModal = () => {
      document.getElementById('disclaimer-modal').className = 'modal'
    }

    document.getElementById('disclaimer-btn').addEventListener('click', showModal)
    document.querySelector('#disclaimer-modal .modal-background').addEventListener('click', hideModal)
    document.querySelector('#disclaimer-modal button.delete').addEventListener('click', hideModal)

    window.addEventListener('keyup', evt => {
      if (evt.which === 27 || evt.keyCode === 27) {
        hideModal()
      }
    })
  }
}
</script>
