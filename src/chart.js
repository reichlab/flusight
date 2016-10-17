// Chart plotting functions

export default class Chart {
  constructor(d3, elementId) {
    this.d3 = d3
    this.elementId = elementId
  }

  /**
   * Setup scales, axes, markers etc.
   */
  setup() {
    // Sugar !!
    let d3 = this.d3
    // Get div dimensions
    let chartDiv = document.getElementById(this.elementId),
        divWidth = chartDiv.offsetWidth,
        divHeight = 330

    // Create blank chart
    let margin = {
      top: 10, right: 20, bottom: 50, left: 40
    },
        width = divWidth - margin.left - margin.right,
        height = divHeight - margin.top - margin.bottom

    // Initialize values
    let xScale = d3.scalePoint()
        .range([0, width]),
        yScale = d3.scaleLinear()
        .range([height, 0])

    // Add svg
    let svg = d3.select('#' + this.elementId).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')


    // Save variables
    this.svg = svg
    this.xScale = xScale
    this.yScale = yScale
    this.height = height
    this.width = width

    this.setupTimeRect()
    this.setupAxes()
    this.setupBaseline()
    this.setupOnset()
    this.setupPeak()
    // Setup prediction after initial plotting
  }

  // Markers initialization
  // ----------------------

  /**
   * Setup axes
   */
  setupAxes() {
    let d3 = this.d3,
        svg = this.svg,
        xScale = this.xScale,
        yScale = this.yScale,
        width = this.width,
        height = this.height

    let xAxis = d3.axisBottom(xScale)
        .tickValues(xScale.domain().filter((d, i) => !(i % 2)))

    let yAxis = d3.axisLeft(yScale)

    svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .append('text')
      .attr('class', 'title')
      .attr('text-anchor', 'end')
      .attr('transform', 'translate(' + width + ',' + 35 + ')')
      .text('Epidemic Week')

    svg.append('g')
      .attr('class', 'axis axis-y')
      .call(yAxis)
      .append('text')
      .attr('class', 'title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Weighted ILI (%)')
  }

  /**
   * Setup current time rectangle
   */
  setupTimeRect() {
    this.svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 0)
      .attr('height', this.height)
      .attr('class', 'timerect')
  }

  /**
   * Setup baseline
   */
  setupBaseline() {
    this.svg.append('line')
      .attr('x1', 0)
      .attr('y1', this.height)
      .attr('x2', this.width)
      .attr('y2', this.height)
      .attr('class', 'baseline')
  }

  /**
   * Setup onset marker
   * One central circle, two end line markers and a range line
   */
  setupOnset() {
    let group = this.svg.append('g').attr('class', 'onset-group')

    let stp = 10,
        size = 0,
        cx = 0,
        cy = this.height - 15

    group.append('line')
      .attr('x1', cx - size / 2)
      .attr('y1', cy)
      .attr('x2', cx + size / 2)
      .attr('y2', cy)
      .attr('class', 'range onset-range')

    group.append('line')
      .attr('x1', cx - size / 2)
      .attr('y1', cy - stp / 2)
      .attr('x2', cx - size / 2)
      .attr('y2', cy + stp / 2)
      .attr('class', 'stopper onset-stopper onset-low')

    group.append('line')
      .attr('x1', cx + size / 2)
      .attr('y1', cy - stp / 2)
      .attr('x2', cx + size / 2)
      .attr('y2', cy + stp / 2)
      .attr('class', 'stopper onset-stopper onset-high')

    group.append('rect')
      .attr('x', cx - 4)
      .attr('y', cy - 4)
      .attr('width', 8)
      .attr('height', 8)
      .attr('class', 'onset-mark')

    // Effects
    group.selectAll('.onset-mark')
      .on('mouseover', function(d) {
        d3.select(this)
          .transition()
          .duration(100)
          .style('stroke-width', '12')
      })
      .on('mouseout', function(d) {
        d3.select(this)
          .transition()
          .duration(300)
          .style('stroke-width', '6')
      })
  }

  /**
   * Setup peak marker
   * One central circle, four end line markers and two range lines
   */
  setupPeak() {
    let d3 = this.d3
    let group = this.svg.append('g').attr('class', 'peak-group')

    let stp = 10,
        sizeX = 0,
        sizeY = 0,
        cx = 0,
        cy = 0

    group.append('line')
      .attr('x1', cx - sizeX / 2)
      .attr('y1', cy)
      .attr('x2', cx + sizeX / 2)
      .attr('y2', cy)
      .attr('class', 'range peak-range peak-range-x')

    group.append('line')
      .attr('x1', cx)
      .attr('y1', cy - sizeY / 2)
      .attr('x2', cx)
      .attr('y2', cy + sizeY / 2)
      .attr('class', 'range peak-range peak-range-y')

    group.append('line')
      .attr('x1', cx - sizeX / 2)
      .attr('y1', cy - stp / 2)
      .attr('x2', cx - sizeX / 2)
      .attr('y2', cy + stp / 2)
      .attr('class', 'stopper peak-stopper peak-low-x')

    group.append('line')
      .attr('x1', cx + sizeX / 2)
      .attr('y1', cy - stp / 2)
      .attr('x2', cx + sizeX / 2)
      .attr('y2', cy + stp / 2)
      .attr('class', 'stopper peak-stopper peak-high-x')

    group.append('line')
      .attr('x1', cx - stp / 2)
      .attr('y1', cy - sizeY / 2)
      .attr('x2', cx + stp / 2)
      .attr('y2', cy - sizeY / 2)
      .attr('class', 'stopper peak-stopper peak-low-y')

    group.append('line')
      .attr('x1', cx - stp / 2)
      .attr('y1', cy + sizeY / 2)
      .attr('x2', cx + stp / 2)
      .attr('y2', cy + sizeY / 2)
      .attr('class', 'stopper peak-stopper peak-high-y')

    group.append('rect')
      .attr('x', cx - 4)
      .attr('y', cy - 4)
      .attr('width', 8)
      .attr('height', 8)
      .attr('class', 'peak-mark')

    // Effects
    group.selectAll('.peak-mark')
      .on('mouseover', function(d) {
        d3.select(this)
          .transition()
          .duration(100)
          .style('stroke-width', '15')
      })
      .on('mouseout', function(d) {
        d3.select(this)
          .transition()
          .duration(300)
          .style('stroke-width', '10')
      })
  }

  /**
   * Setup predictions
   * Five points (with current), a path joining them and an area
   */
  setupPrediction() {
    let d3 = this.d3,
        xScale = this.xScale,
        yScale = this.yScale,
        svg = this.svg

    svg.selectAll('.prediction-group')
      .remove()

    let group = svg.append('g').attr('class', 'prediction-group')

    let data = [{'week': 100001, 'data': 0, 'low': 0, 'high': 0}]

    // Add area
    let area = d3.area()
        .x(d => xScale(d.week % 100))
        .y1(d => yScale(d.low))
        .y0(d => yScale(d.high))

    group.append('path')
      .datum(data)
      .attr('class', 'area-prediction')
      .attr('d', area)

    // Add line
    let line = d3.line()
        .x(d => xScale(d.week % 100))
        .y(d => yScale(d.data))

    group.append('path')
      .datum(data)
      .attr('class', 'line-prediction')
      .attr('d', line)

    // Add circles
    let circles = group.selectAll('.point-prediction')
        .data(data)

    circles.enter().append('circle')
      .merge(circles)
      .attr('cx', d => xScale(d.week % 100))
      .attr('cy', d => yScale(0))
      .attr('class', 'point-prediction')
      .attr('r', 0)
      .transition()
      .delay((d, i) => (i * 5))
      .ease(d3.easeQuadOut)
      .attr('cy', d => yScale(d.data))
      .attr('r', 3)
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

    svg.select('.axis-x')
      .transition().duration(200).call(xAxis)

    svg.select('.axis-y')
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
    svg.select('.line-actual')
      .transition()
      .duration(300)
      .style('opacity', 0)
      .remove()

    // Add new
    svg.append('path')
      .datum(subData.actual)
      .attr('class', 'line-actual')
      .attr('d', line)

    // Add circles
    let circles = svg.selectAll('.point-actual')
        .data(subData.actual)

    circles.exit().remove()

    circles.enter().append('circle')
      .merge(circles)
      .attr('cx', d => xScale(d.week % 100))
      .attr('cy', d => yScale(0))
      .attr('class', 'point-actual')
      .attr('r', 0)
      .transition()
      .delay((d, i) => (i * 5))
      .ease(d3.easeQuadOut)
      .attr('cy', d => yScale(d.data))
      .attr('r', 2.5)

    this.makeInteractive()

    // Save for later
    this.subData = subData

    this.setupPrediction()
  }

  // Add prediction
  // Markers:
  // + path
  // + circles
  // + confidence region
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

    // Actual data points
    this.svg.selectAll('.point-actual')
      .on('mouseover', function(d) {
        d3.select(this)
          .transition()
          .duration(100)
          .attr('r', 4)
      })
      .on('mouseout', function(d) {
        d3.select(this)
          .transition()
          .duration(300)
          .attr('r', 2.5)
      })
  }

  // Add legend
  addLegend() {

  }
}
