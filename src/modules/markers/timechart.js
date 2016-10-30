// Markers for time chart

export class Predictions {
  //
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
    this.data = data.actual
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
  //
}

export class Legend {
  //
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
    this.group.select('.baseline')
      .transition()
      .duration(300)
      .attr('y1', parent.yScale(data.baseline))
      .attr('y2', parent.yScale(data.baseline))

    this.group.select('.title')
      .transition()
      .duration(300)
      .attr('dy', parent.yScale(data.baseline))
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
    this.data = data.actual

    this.group.select('.line-actual')
      .datum(this.data)
      .transition()
      .duration(200)
      .attr('d', line)

    let circles = this.group.selectAll('.point-actual')
        .data(this.data)

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
}
