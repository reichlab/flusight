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
      top: 10, right: 20, bottom: 30, left: 20
    },
        width = divWidth - margin.left - margin.right,
        height = divHeight - margin.top - margin.bottom

    let xScale = d3.scaleLinear().range([0, width]),
        yScale = d3.scaleLinear().range([height, 0])

    // Add svg
    let svg = d3.select('#' + this.elementId).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    // Test data
    let data = [23, 43, 12, 45, 17, 5, 12, 56, 18,
                23, 43, 12, 15, 17, 19, 23, 29, 33].map((val, idx) => {
                  return {
                    week: idx,
                    value: val
                  }
                })

    xScale.domain(d3.extent(data, d => d.week))
    yScale.domain(d3.extent(data, d => d.value))

    svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xScale))

    svg.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Weighted ILI (%)')

    // Set variables
    this.svg = svg
    this.xScale = xScale
    this.yScale = yScale
    this.data = data
  }

  // Draw the chart for first time
  addLine() {
    let d3 = this.d3,
        svg = this.svg,
        xScale = this.xScale,
        yScale = this.yScale,
        data = this.data

    // Main line
    let line = d3.line()
        .x(d => xScale(d.week))
        .y(d => yScale(d.value))

    svg.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line)

    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.week))
      .attr('cy', d => yScale(d.value))
      .attr('r', 3)
      .attr('class', 'point')
  }

  // TODO: Implement functions

  // Add actual data
  // Markers:
  // + path
  // + circles
  // + baseline
  //   + horizontal line
  plotActual() {

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
          .attr("r", 5)
      })
      .on('mouseout', function(d) {
        d3.select(this)
          .transition()
          .attr("r", 3)
      })
  }

  // Add legend
  addLegend() {

  }
}
