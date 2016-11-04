// Markers for time chart

import * as util from '../utils/timechart'

export class Prediction {
  constructor(parent, id, meta, color) {

    // Prediction group
    let predictionGroup = parent.svg.append('g')
        .attr('class', 'prediction-group')
        .attr('id', id + '-marker')

    predictionGroup.append('path')
      .attr('class', 'area-prediction')
      .style('fill', color)

    predictionGroup.append('path')
      .attr('class', 'line-prediction')
      .style('stroke', color)

    predictionGroup.selectAll('.point-prediction')
      .enter()
      .append('circle')
      .attr('class', 'point-prediction')
      .style('stroke', color)

    this.predictionGroup = predictionGroup

    // Create onset group
    let onsetGroup = parent.svg.append('g')
        .attr('class', 'onset-group')
        .attr('id', id + '-marker')

    let stp = 10,
        cy = parent.height - 15

    onsetGroup.append('line')
      .attr('y1', cy)
      .attr('y2', cy)
      .attr('class', 'range onset-range')

    onsetGroup.append('line')
      .attr('y1', cy - stp / 2)
      .attr('y2', cy + stp / 2)
      .attr('class', 'stopper onset-stopper onset-low')

    onsetGroup.append('line')
      .attr('y1', cy - stp / 2)
      .attr('y2', cy + stp / 2)
      .attr('class', 'stopper onset-stopper onset-high')

    onsetGroup.append('circle')
      .attr('r', 5)
      .attr('cy', cy)
      .attr('class', 'onset-mark')
      .style('stroke', 'transparent')
      .style('fill', util.hexToRgba(color, 0.8))

    this.onsetGroup = onsetGroup

    // Peak group
    let peakGroup = parent.svg.append('g')
        .attr('class', 'peak-group')
        .attr('id', id + '-marker')

    peakGroup.append('line')
      .attr('class', 'range peak-range peak-range-x')

    peakGroup.append('line')
      .attr('class', 'range peak-range peak-range-y')

    peakGroup.append('line')
      .attr('class', 'stopper peak-stopper peak-low-x')

    peakGroup.append('line')
      .attr('class', 'stopper peak-stopper peak-high-x')

    peakGroup.append('line')
      .attr('class', 'stopper peak-stopper peak-low-y')

    peakGroup.append('line')
      .attr('class', 'stopper peak-stopper peak-high-y')

    peakGroup.append('circle')
      .attr('r', 5)
      .attr('class', 'peak-mark')
      .style('stroke', 'transparent')
      .style('fill', util.hexToRgba(color, 0.8))

    this.peakGroup = peakGroup

    this.color = color
    this.id = id
    this.meta = meta
    this.d3 = parent.d3
  }

  plot(parent, data, actual) {
    this.data = data
    this.actual = actual
    this.xScale = parent.xScaleWeek
    this.yScale = parent.yScale
    this.weeks = parent.weeks
    this.legendHidden = false

    this.displayedData = Array(this.weeks.length).fill(false)
  }

  update(idx) {
    let d3 = this.d3
    let color = this.color
    let id = this.id
    let week = this.weeks[idx]

    let localPosition = this.data.map(d => d.week % 100).indexOf(week)

    if (localPosition == -1) {
      this.hidden = true
      this.hideMarkers()
    } else {
      this.hidden = false
      if (!this.legendHidden) {
        this.showMarkers()
      }

      this.displayedPoints = {}

      // Move things
      let onset = this.data[localPosition].onsetWeek
      this.displayedPoints.onset = onset.point

      this.onsetGroup.select('.onset-mark')
        .transition()
        .duration(200)
        .attr('cx', this.xScale(onset.point))

      this.onsetGroup.select('.onset-mark')
        .on('mouseover', function() {
          d3.select(this)
            .transition()
            .duration(300)
            .style('stroke', util.hexToRgba(color, 0.3))
          d3.select('#chart-tooltip')
            .style('display', null)
            .html(util.pointTooltip(id, [
              {
                key: 'Season Onset',
                value: onset.point
              }
            ], color))
        })
        .on('mouseout', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .style('stroke', 'transparent')
        })

      this.onsetGroup.select('.onset-range')
        .transition()
        .duration(200)
        .attr('x1', this.xScale(onset.low))
        .attr('x2', this.xScale(onset.high))

      this.onsetGroup.select('.onset-low')
        .transition()
        .duration(200)
        .attr('x1', this.xScale(onset.low))
        .attr('x2', this.xScale(onset.low))

      this.onsetGroup.select('.onset-high')
        .transition()
        .duration(200)
        .attr('x1', this.xScale(onset.high))
        .attr('x2', this.xScale(onset.high))

    let pw = this.data[localPosition].peakWeek,
        pp = this.data[localPosition].peakPercent

      this.displayedPoints.peak = pw.point

      let leftW = this.xScale(pw.point),
          leftP = this.yScale(pp.point)
      this.peakGroup.select('.peak-mark')
        .transition()
        .duration(200)
        .attr('cx', leftW)
        .attr('cy', leftP)

      this.peakGroup.select('.peak-mark')
        .on('mouseover', function() {
          d3.select(this)
            .transition()
            .duration(300)
            .style('stroke', util.hexToRgba(color, 0.3))
          d3.select('#chart-tooltip')
            .style('display', null)
            .html(util.pointTooltip(id, [
              {
                key: 'Peak Percent',
                value: pp.point.toFixed(2)
              },
              {
                key: 'Peak Week',
                value: pw.point
              }
            ], color))
        })
        .on('mouseout', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .style('stroke', 'transparent')
        })

      this.peakGroup.select('.peak-range-x')
        .transition()
        .duration(200)
        .attr('x1', this.xScale(pw.low))
        .attr('x2', this.xScale(pw.high))
        .attr('y1', this.yScale(pp.point))
        .attr('y2', this.yScale(pp.point))

      this.peakGroup.select('.peak-range-y')
        .transition()
        .duration(200)
        .attr('x1', this.xScale(pw.point))
        .attr('x2', this.xScale(pw.point))
        .attr('y1', this.yScale(pp.low))
        .attr('y2', this.yScale(pp.high))

      this.peakGroup.select('.peak-low-x')
        .transition()
        .duration(200)
        .attr('x1', this.xScale(pw.low))
        .attr('x2', this.xScale(pw.low))
        .attr('y1', this.yScale(pp.point) - 5)
        .attr('y2', this.yScale(pp.point) + 5)

      this.peakGroup.select('.peak-high-x')
        .transition()
        .duration(200)
        .attr('x1', this.xScale(pw.high))
        .attr('x2', this.xScale(pw.high))
        .attr('y1', this.yScale(pp.point) - 5)
        .attr('y2', this.yScale(pp.point) + 5)

      leftW = this.xScale(pw.point)
      this.peakGroup.select('.peak-low-y')
        .transition()
        .duration(200)
        .attr('x1', (!leftW ? 0 : leftW) - 5)
        .attr('x2', (!leftW ? 0 : leftW) + 5)
        .attr('y1', this.yScale(pp.low))
        .attr('y2', this.yScale(pp.low))

      this.peakGroup.select('.peak-high-y')
        .transition()
        .duration(200)
        .attr('x1', (!leftW ? 0 : leftW) - 5)
        .attr('x2', (!leftW ? 0 : leftW) + 5)
        .attr('y1', this.yScale(pp.high))
        .attr('y2', this.yScale(pp.high))

      // Move main pointers
      let predData = this.data[localPosition]

      let startWeek = predData.week,
          startData = this.actual.filter(d => d.week == startWeek)[0].data

      let data = [{
        week: startWeek % 100,
        data: startData,
        low: startData,
        high: startData
      }]

      let names = ['oneWk', 'twoWk', 'threeWk', 'fourWk']
      let nextWeeks = util.getNextWeeks(startWeek, this.weeks)

      nextWeeks.forEach((item, index) => {
        data.push({
          week: item,
          data: predData[names[index]].point,
          low: predData[names[index]].low,
          high: predData[names[index]].high
        })
      })

      // Save week indexed data
      data.forEach((d, index) => {
        if (index > 0) this.displayedData[this.weeks.indexOf(d.week)] = d.data
        else this.displayedData[this.weeks.indexOf(d.week)] = false
      })

      let circles = this.predictionGroup.selectAll('.point-prediction')
          .data(data.slice(1))

      circles.exit().remove()

      circles.enter().append('circle')
        .merge(circles)
        .attr('class', 'point-prediction')
        .transition()
        .duration(200)
        .ease(this.d3.easeQuadOut)
        .attr('cx', d => this.xScale(d.week))
        .attr('cy', d => this.yScale(d.data))
        .attr('r', 3)
        .style('stroke', this.color)

      let line = this.d3.line()
          .x(d => this.xScale(d.week % 100))
          .y(d => this.yScale(d.data))

      this.predictionGroup.select('.line-prediction')
        .datum(data)
        .transition()
        .duration(200)
        .attr('d', line)

      let area = this.d3.area()
          .x(d => this.xScale(d.week % 100))
          .y1(d => this.yScale(d.low))
          .y0(d => this.yScale(d.high))

      this.predictionGroup.select('.area-prediction')
        .datum(data)
        .transition()
        .duration(200)
        .attr('d', area)
    }
  }

  hideMarkers() {
    this.onsetGroup
      .style('visibility', 'hidden')

    this.peakGroup
      .style('visibility', 'hidden')

    this.predictionGroup
      .style('visibility', 'hidden')
  }

  showMarkers() {
    // Only show if not hidden
    if (this.hidden) return

    this.onsetGroup
      .style('visibility', null)

    this.peakGroup
      .style('visibility', null)

    this.predictionGroup
      .style('visibility', null)
  }

  clear() {
    this.onsetGroup.remove();
    this.peakGroup.remove();
    this.predictionGroup.remove();
  }

  query(idx) {

    // Don't show anything if predictions are hidden
    if (this.hidden || this.legendHidden) return false

    return this.displayedData[idx]
  }
}

/**
 * Time rectangle for navigation guidance
 */
export class TimeRect {
  constructor(parent) {
    this.rect = parent.svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 0)
      .attr('height', parent.height)
      .attr('class', 'timerect')
  }

  plot(parent, data) {
    // Save local data
    this.data = data
    this.scale = parent.xScaleWeek
  }

  update(idx) {
    this.rect
      .transition()
      .duration(200)
      .attr('width', this.scale(this.data[idx].week % 100))
  }
}

export class HistoricalLines {
  constructor(parent) {
    //
  }

  plot(parent, data) {
    //
  }

  hide() {
    //
  }

  show() {
    //
  }

  clear() {
    //
  }
}

export class Legend {
  constructor(parent, legendHook) {
    let legendDiv = parent.d3.select('#legend')
    legendDiv.selectAll('*').remove()

    let actualItem = legendDiv.append('div')
        .attr('class', 'item')
        .attr('id', 'legend-actual')

    actualItem.append('i')
      .attr('class', 'fa fa-circle')
      .style('color', 'green')

    actualItem.append('span')
      .attr('class', 'item-title')
      .html('Actual')

    // Meta data info tooltip
    let tooltip = parent.d3.select('body')
        .append('div')
        .attr('id', 'legend-tooltip')
        .style('display', 'none')

    parent.predictions.forEach(p => {
      let predItem = legendDiv.append('div')
          .attr('class', 'item')
          .attr('id', 'legend-' + p.id)
          .style('cursor', 'pointer')

      predItem.append('i')
        .attr('class', 'fa fa-circle')
        .style('color', p.color)

      predItem.append('span')
        .attr('class', 'item-title')
        .html(p.id)

      predItem
        .on('click', function() {
          let iElem = parent.d3.select(this).select('i')
          let isActive = iElem.classed('fa-circle')

          iElem.classed('fa-circle', !isActive)
          iElem.classed('fa-circle-o', isActive)

          legendHook(p.id, isActive)
        })

      predItem
        .on('mouseover', function() {
          tooltip.style('display', null)
        })
        .on('mouseout', function() {
          tooltip.style('display', 'none')
        })
        .on('mousemove', function() {
          tooltip
            .style('top', (event.clientY + 20) + 'px')
            .style('left', (event.clientX - 150 - 20) + 'px')
            .html(util.legendTooltip(p.meta))
        })
    })

    this.tooltip = tooltip
    this.legendDiv = legendDiv
    this.d3 = parent.d3
  }

  update(predictions) {
    let d3 = this.d3,
        legendDiv = this.legendDiv

    predictions.forEach(p => {
      let pDiv = legendDiv.select('#legend-' + p.id)
      if (p.hidden) {
        pDiv
          .classed('na', true)
      } else {
        pDiv
          .classed('na', false)
      }
    })
  }
}

/**
 * CDC Baseline
 */
export class Baseline {
  constructor(parent) {
    let group = parent.svg.append('g')
      .attr('class', 'baseline-group')

    group.append('line')
      .attr('x1', 0)
      .attr('y1', parent.height)
      .attr('x2', parent.width)
      .attr('y2', parent.height)
      .attr('class', 'baseline')

    let text = group.append('text')
        .attr('class', 'title')
        .attr('transform', 'translate(' + (parent.width + 10) + ', 0)')
    text.append('tspan')
      .text('CDC')
      .attr('x', 0)
    text.append('tspan')
      .text('Baseline')
      .attr('x', 0)
      .attr('dy', '1em')

    this.group = group
  }

  plot(parent, data) {
    if (data) this.show()
    else {
      this.hide()
      return
    }

    this.group.select('.baseline')
      .transition()
      .duration(300)
      .attr('y1', parent.yScale(data))
      .attr('y2', parent.yScale(data))

    this.group.select('.title')
      .transition()
      .duration(300)
      .attr('dy', parent.yScale(data))
  }

  // Hide baseline
  hide() {
    this.group
      .style('visibility', 'hidden')
  }

  // Show baseline
  show() {
    this.group
      .style('visibility', null)
  }
}

/**
 * Actual line
 */
export class Actual {
  constructor(parent) {
    let group = parent.svg.append('g')
        .attr('class', 'actual-group')

    group.append('path')
      .attr('class', 'line-actual')

    group.selectAll('.point-actual')
      .enter()
      .append('circle')
      .attr('class', 'point-actual')

    this.group = group
  }

  plot(parent, data) {
    let line = parent.d3.line()
        .x(d => parent.xScaleWeek(d.week % 100))
        .y(d => parent.yScale(d.data))

    // Save data for queries
    this.data = data

    this.group.select('.line-actual')
      .datum(this.data.filter(d => d.data != -1))
      .transition()
      .duration(200)
      .attr('d', line)

    // Only plot non -1
    let circles = this.group.selectAll('.point-actual')
        .data(this.data.filter(d => d.data != -1))

    circles.exit().remove()

    circles.enter().append('circle')
      .merge(circles)
      .attr('class', 'point-actual')
      .transition(200)
      .ease(parent.d3.easeQuadOut)
      .attr('cx', d => parent.xScaleWeek(d.week % 100))
      .attr('cy', d => parent.yScale(d.data))
      .attr('r', 2)
  }

  query(idx) {
    return this.data[idx].data
  }
}
