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

    let xScale = d3.scalePoint().range([0, width]),
        yScale = d3.scaleLinear().range([height, 0])

    // Add svg
    let svg = d3.select('#' + this.elementId).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    // Setup scale with 52 ticks from 30 to 29
    let numWeeks = 52
    let shiftedWeeks = [...Array(numWeeks).keys()].map((d, i, arr) => arr[(i + 29) % numWeeks] + 1)

    xScale.domain(shiftedWeeks)

    let xAxis = d3.axisBottom(xScale)
        .tickValues(xScale.domain().filter((d, i) => !(i % 2)))

    svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)

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
