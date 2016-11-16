// Chart plotting functions

import * as util from './utils/timechart'
import * as marker from './markers/timechart'
import textures from 'textures'

export default class TimeChart {
  constructor(d3, elementId, weekHook) {
    // Get div dimensions
    let footBB = d3.select('.footer').node().getBoundingClientRect(),
        chartBB = d3.select('#' + elementId).node().getBoundingClientRect()

    let divWidth = chartBB.width,
        divHeight = window.innerHeight - chartBB.top - footBB.height

    // Padding offsets
    divHeight -= 50

    // Limits
    divHeight = Math.min(Math.max(350, divHeight), 600)

    let onsetOffset = 30

    // Create blank chart
    let margin = {
      top: 1 + onsetOffset + 5, right: 50, bottom: 70, left: 40
    },
        width = divWidth - margin.left - margin.right,
        height = divHeight - margin.top - margin.bottom

    // Initialize scales and stuff
    let xScale = d3.scaleLinear()
        .range([0, width]),
        yScale = d3.scaleLinear()
        .range([height, 0]),
        xScaleDate = d3.scaleTime()
        .range([0, width])

    // Add svg
    let svg = d3.select('#' + elementId).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    // Add tooltips
    this.chartTooltip = d3.select('#chart-tooltip')
      .style('display', 'none')

    this.legendTooltip = d3.select('#legend-tooltip')
      .style('display', 'none')

    // Save variables
    this.d3 = d3
    this.svg = svg
    this.xScale = xScale
    this.yScale = yScale
    this.xScaleDate = xScaleDate
    this.height = height
    this.width = width
    this.onsetOffset = onsetOffset
    this.weekHook = weekHook

    // Add axes
    this.setupAxes()

    // Add marker primitives
    this.timerect = new marker.TimeRect(this)

    // Add overlays and other mouse interaction items
    this.setupOverlay()

    this.history = new marker.HistoricalLines(this)
    this.baseline = new marker.Baseline(this)
    this.actual = new marker.Actual(this)
    this.predictions = []

    // Hard coding as of now
    this.confidenceIntervals = ['90%', '50%']
    this.cid = 1 // Use 50% as default

    // Legend toggle state
    this.historyShow = true
    this.predictionsShow = {}

    this.onsetTexture = textures.lines()
      .lighter()
      .strokeWidth(0.5)
      .size(8)
      .stroke('#ccc')
      .background('white')
    svg.call(this.onsetTexture)

    // Paint the top region
    this.paintOnsetOffset()
  }

  /**
   * Setup axes
   */
  setupAxes() {
    let svg = this.svg,
        d3 = this.d3,
        width = this.width,
        height = this.height

    let infoTooltip = d3.select('#info-tooltip')

    svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', 'translate(0,' + height + ')')

    let axisXDate = svg.append('g')
        .attr('class', 'axis axis-x-date')
        .attr('transform', 'translate(0,' + (height + 25) + ')')

    let xText = axisXDate
        .append('text')
        .attr('class', 'title')
        .attr('text-anchor', 'start')
        .attr('transform', 'translate(' + (width + 10) + ',-15)')

    xText.append('tspan')
      .text('Epidemic')
      .attr('x', 0)
    xText.append('tspan')
      .text('Week')
      .attr('x', 0)
      .attr('dy', '1em')

    xText.style('cursor', 'pointer')
      .on('mouseover', function() {
        infoTooltip
          .style('display', null)
      })
      .on('mouseout', function() {
        infoTooltip
          .style('display', 'none')
      })
      .on('mousemove', function() {
        infoTooltip
          .style('top', (d3.event.pageY - 20) + 'px')
          .style('left', (d3.event.pageX - 150 - 20) + 'px')
          .html('Week of the calendar year, as measured by the CDC.<br><br><em>Click to know more</em>')
      })
      .on('click', function() {
        window.open('https://wwwn.cdc.gov/nndss/document/MMWR_Week_overview.pdf', '_blank')
      })

    svg.append('g')
      .attr('class', 'axis axis-y')
      .append('text')
      .attr('class', 'title')
      .attr('transform', 'translate(-40 ,' + height / 2 + ') rotate(-90)')
      .attr('dy', '.71em')
      .style('text-anchor', 'middle')
      .text('Weighted ILI (%)')
      .style('cursor', 'pointer')
      .on('mouseover', function() {
        infoTooltip
          .style('display', null)
      })
      .on('mouseout', function() {
        infoTooltip
          .style('display', 'none')
      })
      .on('mousemove', function() {
        infoTooltip
          .style('top', d3.event.pageY + 'px')
          .style('left', (d3.event.pageX + 20) + 'px')
          .html('Percentage of outpatient doctor visits for influenza-like illness, weighted by state population.<br><br><em>Click to know more</em>')
      })
      .on('click', function() {
        window.open('http://www.cdc.gov/flu/weekly/overview.htm', '_blank') // TODO: Add link
      })
  }

  /**
   * Setup overlay for mouse events
   */
  setupOverlay() {
    let svg = this.svg,
        height = this.height,
        width = this.width,
        tooltip = this.chartTooltip

    // Add vertical line
    let line = svg.append('line')
        .attr('class', 'hover-line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', height)
        .style('display', 'none')

    // Get bounding box
    let bb = svg.node().getBoundingClientRect()

    svg.append('rect')
      .attr('class', 'overlay')
      .attr('height', height)
      .attr('width', width)
      .on('mouseover', () => {
        line.style('display', null)
        tooltip.style('display', null)
      })
      .on('mouseout', () => {
        line.style('display', 'none')
        tooltip.style('display', 'none')
      })
  }

  paintOnsetOffset() {
    this.svg.append('rect')
      .attr('class', 'onset-paint')
      .attr('height', this.onsetOffset + 5)
      .attr('width', this.width)
      .attr('x', 0)
      .attr('y', - this.onsetOffset - 5)

    this.svg.append('rect')
      .attr('class', 'onset-texture')
      .attr('height', this.onsetOffset)
      .attr('width', this.width)
      .attr('x', 0)
      .attr('y', - this.onsetOffset - 5)
      .style('fill', this.onsetTexture.url())
  }

  // plot data
  plot(data) {
    let d3 = this.d3,
        svg = this.svg,
        xScale = this.xScale,
        yScale = this.yScale,
        xScaleDate = this.xScaleDate,
        tooltip = this.chartTooltip,
        weekHook = this.weekHook

    // Reset scales and axes
    yScale.domain([0, Math.min(13, util.getYMax(data))])
    // Assuming actual data has all the weeks
    let weeks = data.actual.map(d => d.week % 100)
    let actualIndices = data.actual
        .filter(d => d.data !== -1)
        .map(d => weeks.indexOf(d.week % 100))
    xScale.domain([0, weeks.length - 1])

    // Setup a scale for ticks
    let xScalePoint = d3.scalePoint()
        .domain(weeks)
        .range([0, this.width])

    // Week domain scale for easy mapping
    let xScaleWeek = (d) => {
      let dInt = Math.floor(d),
          dFloat = d % 1
      // [0, 1) point fix without changing the scale
      if (dInt === 0)
        dInt = Math.max(...weeks)
      if (dInt === 29)
        dFloat = 0
      return xScale(weeks.indexOf(dInt) + dFloat)
    }

    // Week to date parser
    let dateParser = d3.timeParse('%Y-%U')
    xScaleDate.domain(d3.extent(data.actual.map(d => {
      let formattedDate = Math.floor(d.week / 100) + '-' + d.week % 100
      return dateParser(formattedDate)
    })))

    let xAxis = d3.axisBottom(xScalePoint)
        .tickValues(xScalePoint.domain().filter((d, i) => !(i % 2)))

    let xAxisDate = d3.axisBottom(xScaleDate)
        .ticks(d3.timeMonth)
        .tickFormat(d3.timeFormat('%b %y'))

    // Mobile view fix
    if (this.width < 420) {
      xAxisDate.ticks(2)
      xAxis.tickValues(xScalePoint.domain().filter((d, i) => !(i % 10)))
    }

    let yAxis = d3.axisLeft(yScale)

    svg.select('.axis-x')
      .transition().duration(200).call(xAxis)

    svg.select('.axis-x-date')
      .transition().duration(200).call(xAxisDate)

    svg.select('.axis-y')
      .transition().duration(200).call(yAxis)

    // Save
    this.weeks = weeks
    this.actualIndices = actualIndices
    this.xScaleWeek = xScaleWeek

    // Use actualIndices as indicator of whether the season is current
    if (actualIndices.length < weeks.length) {
      // Start at the latest prediction
      this.weekIdx = Math
        .max(...data.models
             .map(m => {
               if (m.predictions.length === 0) return 0
               else {
                 return weeks
                   .indexOf(m.predictions[m.predictions.length - 1].week % 100)
               }
             }))
    } else {
      // Start at the oldest prediction
      let modelPredictions = data.models
          .map(m => {
            if (m.predictions.length === 0) return -1
            else {
              return weeks.indexOf(m.predictions[0].week % 100)
            }
          }).filter(d => d != -1)

      if (modelPredictions.length === 0) {
        // Start at the most recent actual data
        this.weekIdx = this.actualIndices[this.actualIndices.length - 1]
      } else {
        this.weekIdx = Math.min(...modelPredictions)
      }
    }
    this.weekHook({
      idx: this.weekIdx,
      name: this.weeks[this.weekIdx]
    })

    // Update markers with data
    this.timerect.plot(this, data.actual)
    this.baseline.plot(this, data.baseline)
    this.actual.plot(this, data.actual)

    // Reset history lines
    this.history.plot(this, data.history)

    // Reset predictions
    let colors = d3.schemeCategory10

    let totalModels = data.models.length
    let onsetDiff =  (this.onsetOffset - 2) / (totalModels + 1)

    // Filter markers not needed

    let currentPredictionIds = data.models.map(m => m.id)
    this.predictions = this.predictions.filter(p => {
      if (currentPredictionIds.indexOf(p.id) === -1) {
        p.clear()
        return false
      } else {
        return true
      }
    })

    data.models.forEach((m, idx) => {
      // Add marker if not present
      let predMarker,
          markerIndex = this.predictions.map(p => p.id).indexOf(m.id)
      if (markerIndex === -1) {
        let onsetYPos = - (idx + 1) * onsetDiff - 6
        predMarker = new marker.Prediction(this, m.id, m.meta, colors[idx], onsetYPos)
        this.predictions.push(predMarker)

        if (!(m.id in this.predictionsShow))
          this.predictionsShow[m.id] = true
      } else {
        predMarker = this.predictions[markerIndex]
      }
      predMarker.plot(this, m.predictions, data.actual)
      predMarker.hideMarkers()
    })

    // Legend and hook
    this.legend = new marker.Legend(this, (pid, hide) => {
      if (pid === 'legend:history') {
        // On history toggle action
        this.historyShow = !hide
        if (hide) this.history.hide()
        else this.history.show()
      } else {
        // On prediction toggle action
        let pred = this.predictions[this.predictions.map(p => p.id).indexOf(pid)]
        this.predictionsShow[pid] = !hide
        pred.legendHidden = hide

        if (hide) pred.hideMarkers()
        else pred.showMarkers()
      }
    })

    // Confidence selection event
    this.confidenceMarker = new marker.Confidence(this, (cid) => {
      this.predictions.map(p => {
        this.cid = p.cid = cid
        p.update(this.weekIdx)
      })
    })

    let that = this
    // Add mouse move and click events
    let bb = svg.node().getBoundingClientRect()
    d3.select('.overlay')
      .on('mousemove', function() {
        let mouse = d3.mouse(this)
        // Snap x to nearest tick
        let index = Math.round(xScale.invert(mouse[0]))
        let snappedX = xScale(index)
        d3.select('.hover-line')
          .transition()
          .duration(50)
          .attr('x1', snappedX)
          .attr('x2', snappedX)

        tooltip
          .style('top', (d3.event.pageY + 20) + 'px')
          .style('left', (d3.event.pageX + 20) + 'px')
          .html(util.tooltipText(that, index, mouse[1]))
      })
      .on('click', function() {
        let idx = that.capToActual(Math.round(xScale.invert(d3.mouse(this)[0])))
        weekHook({
          idx: idx,
          name: weeks[idx]
        })
      })
  }

  /**
   * Update marker position
   */
  update(idx) {
    // Change self index
    this.weekIdx = idx
    this.timerect.update(idx)

    this.predictions.forEach(p => {
      p.update(idx)
    })

    this.legend.update(this.predictions)
  }

  /**
   * Return capped week index using actual values only
   * Assuming continuos actual data sequence
   */
  capToActual(idx) {
    return Math.max(
      Math.min(this.actualIndices[this.actualIndices.length - 1], idx),
      this.actualIndices[0]
    )
  }

  // External interaction functions
  // ------------------------------

  /**
   * Return next week idx and name for vuex store
   */
  getNextWeekData() {
    let nextIdx = this.capToActual(Math.min(this.weeks.length - 1, this.weekIdx + 1))
    return {
      idx: nextIdx,
      name: this.weeks[nextIdx]
    }
  }

  /**
   * Return preview week idx and name for vuex store
   */
  getPreviousWeekData() {
    let previousIdx = this.capToActual(Math.max(0, this.weekIdx - 1))
    return {
      idx: previousIdx,
      name: this.weeks[previousIdx]
    }
  }
}
