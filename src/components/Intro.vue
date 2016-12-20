<style lang="scss" scoped>

#intro-tooltip {
  z-index: 900;
  position: fixed;
  top: 0px;
  left: 0px;
  background-color: white;
  padding: 15px 20px;
  box-shadow: 0px 0px 5px;
  border-radius: 2px;
  color: #333;
  font-size: 11px;
  width: 300px;
  #intro-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  #intro-content {
    font-size: 13px;
    margin-bottom: 20px;
  }
  .right {
    float: right;
  }
  #intro-buttons a {
    margin: 0px 2px;
  }
}

#intro-overlay {
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 800;
}

</style>

<template lang="pug">
// Dark overlay during demo
#intro-overlay(v-on:click="moveIntroFinish" v-show="introShow")

#intro-tooltip(v-show="introShow")
  #intro-title {{ currentIntro.title }}
  #intro-content(v-html="currentIntro.content")
  #intro-buttons

    // Close intro button
    a.button.is-small(v-on:click="moveIntroFinish")
      span.icon.is-small
        i.fa.fa-times
      span Finish

    span.right
      // Movement buttons
      a(
        v-bind:class=`[introAtFirst ? 'is-disabled' : '',
                      'button is-info is-small is-outlined']`
        v-on:click="moveIntroBackward"
       )
        span.icon.is-small
          i.fa.fa-angle-left
        span Previous

      a(
        v-bind:class=`[introAtLast ? 'is-disabled' : '',
                      'button is-info is-small']`
        v-on:click="moveIntroForward"
       )
        span.icon.is-small
          i.fa.fa-angle-right
        span Next
</template>

<script>
import {
  currentIntro,
  introAtFirst,
  introAtLast,
  introShow,
  introStep
} from '../vuex/getters'

import {
  moveIntroForward,
  moveIntroBackward,
  moveIntroFinish,
  moveIntroStart
} from '../vuex/actions'

export default {
  vuex: {
    getters: {
      currentIntro,
      introAtFirst,
      introAtLast,
      introShow,
      introStep
    },
    actions: {
      moveIntroForward,
      moveIntroBackward,
      moveIntroFinish,
      moveIntroStart
    }
  },
  methods: {
    demoStep(data) {
      let tooltip = this.$d3.select('#intro-tooltip')
      let tooltipBB = tooltip.node().getBoundingClientRect()

      if (data.element === '') {
        let xPos = (window.innerWidth - tooltipBB.width) / 2
        let yPos = (window.innerHeight - tooltipBB.height) / 2

        tooltip.transition()
          .duration(200)
          .style('top', yPos + 'px')
          .style('left', xPos + 'px')
      } else {
        let target = this.$d3.select(data.element)
        let targetBB = target.node().getBoundingClientRect()

        // Highlight current div
        target.style('z-index', '850')

        let yPos = targetBB.top

        if (data.direction === 'left') {
          tooltip.transition()
            .duration(200)
            .style('top', yPos + 'px')
            .style('left', (targetBB.left - tooltipBB.width - 20) + 'px')
        } else {
          tooltip.transition()
            .duration(200)
            .style('top', yPos + 'px')
            .style('left', (targetBB.left + targetBB.width + 20) + 'px')
        }
      }
    },
    setLastElement(el) {
      this.lastElement = el
    }
  },
  ready() {
    this.demoStep(this.currentIntro)
    this.moveIntroFinish()

    // Check for first run
    // Trigger intro
    if
      (document.cookie.replace(/(?:(?:^|.*;\s*)firstRun\s*\=\s*([^;]*).*$)|^.*$/,
                               "$1") !== "true") {
        document.cookie = "firstRun=true; expires=Fri, 31 Dec 9999 23:59:59 GMT"
        this.moveIntroStart()
      }
  },
  data() {
    return {
      lastElement: ''
    }
  },
  watch: {
    introStep: function() {
      this.demoStep(this.currentIntro)
      // Un-highlight previous div
      if (this.lastElement !== '') {
        this.$d3.select(this.lastElement)
          .style('z-index', null)
      }

      // Save current as last element
      this.setLastElement(this.currentIntro.element)
    }
  }
}
</script>
