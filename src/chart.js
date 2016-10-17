// Chart plotting functions

export default class Chart {
  constructor(d3, elementId) {
    this.d3 = d3
    this.elementId = elementId
  }

  // Draw axes etc.
  setup() {
    // Sugar !!
    let d3 = this.d3
    // Get div dimensions
    let chartDiv = document.getElementById(this.elementId),
        divWidth = chartDiv.offsetWidth,
        divHeight = 300

    // Create blank chart
    let margin = {
      top: 10, right: 20, bottom: 30, left: 40
    },
        width = divWidth - margin.left - margin.right,
        height = divHeight - margin.top - margin.bottom

    // Initialize values
    let xScale = d3.scalePoint()
        .range([0, width])
        .domain([0, 1, 2]),
        yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 1])

    // Add svg
    let svg = d3.select('#' + this.elementId).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    let xAxis = d3.axisBottom(xScale)
        .tickValues(xScale.domain().filter((d, i) => !(i % 2)))

    let yAxis = d3.axisLeft(yScale)

    svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + yScale.range()[0] + ')')
      .call(xAxis)

    svg.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis)
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Weighted ILI (%)')

    // Current time rectangle
    svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 0)
      .attr('height', height)
      .attr('class', 'timerect')

    // Initial baseline
    svg.append('line')
      .attr('x1', xScale.range()[0])
      .attr('y1', yScale.range()[0])
      .attr('x2', xScale.range()[1])
      .attr('y2', yScale.range()[0])
      .attr('class', 'baseline')

    // Onset markers

    // Peak prediction markers

    // Prediction markers


    // Set variables
    this.svg = svg
    this.xScale = xScale
    this.yScale = yScale
  }

  // Add actual data
  plotActual(subData) {
    let d3 = this.d3,
        svg = this.svg,
        xScale = this.xScale,
        yScale = this.yScale

    // Reset scales and axes
    yScale.domain([0, d3.max(subData.actual.map(d => d.data))])
    // TODO: Intelligently set xscale
    //       Use peak max for these
    xScale.domain(subData.actual.map(d => d.week % 100))

    let xAxis = d3.axisBottom(xScale)
        .tickValues(xScale.domain().filter((d, i) => !(i % 2)))

    let yAxis = d3.axisLeft(yScale)

    svg.select('.axis--x')
      .transition().duration(200).call(xAxis)

    svg.select('.axis--y')
      .transition().duration(200).call(yAxis)

    // Reset baseline
    svg.select('.baseline')
      .transition().duration(300)
      .attr('y1', yScale(subData.baseline))
      .attr('y2', yScale(subData.baseline))

    // Draw actual line
    let line = d3.line()
        .x(d => xScale(d.week % 100))
        .y(d => yScale(d.data))

    // Remove old
    svg.select('.actualline')
      .transition()
      .duration(300)
      .style('opacity', 0)
      .remove()

    // Add new
    svg.append('path')
      .datum(subData.actual)
      .attr('class', 'actualline')
      .attr('d', line)


    let circles = svg.selectAll('.point')
        .data(subData.actual)

    circles.exit().remove()

    circles.enter().append('circle')
      .merge(circles)
      .attr('cx', d => xScale(d.week % 100))
      .attr('cy', d => yScale(0))
      .attr('class', 'point')
      .attr('r', 0)
      .transition()
      .delay((d, i) => (i * 5))
      .ease(d3.easeQuadOut)
      .attr('cy', d => yScale(d.data))
      .attr('r', 2.5)

    this.makeInteractive()

    // Save for later
    this.subData = subData
  }

  // Add prediction
  // Markers:
  // + path
  // + circles
  // + confidence region
  //   + alpha-ed color
  // + peak prediction
  //   + circle
  //   + horizontal/vertical bar
  //   + bar stoppers
  // + onset prediction
  //   + horizontal bar around x axis
  //   + bar stoppers
  plotPrediction() {

  }

  // Add interactivity
  // + circles
  //   + on mouse: scale and show value
  // + prediction line
  //   + on mouse: fade others
  makeInteractive() {
    let d3 = this.d3
    this.svg.selectAll('.point')
      .on('mouseover', function(d) {
        d3.select(this)
          .transition()
          .duration(100)
          .attr("r", 4)
      })
      .on('mouseout', function(d) {
        d3.select(this)
          .transition()
          .duration(300)
          .attr("r", 2.5)
      })

    // this.svg.selectAll('.line')
    //   .on('mouseover', function(d) {
    //     d3.select(this)
    //       .transition()
    //       .duration(0)
    //       .style('stroke-width', '3px')
    //   })
    //   .on('mouseout', function(d) {
    //     d3.select(this)
    //       .transition()
    //       .duration(400)
    //       .style('stroke-width', '1.5px')
    //   })
  }

  // Add legend
  addLegend() {

  }
}
