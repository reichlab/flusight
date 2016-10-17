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
    yScale.domain([0, this.getSubDataMax(subData)])
    // TODO: Intelligently set xscale
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

    // Set pointer in prediction data (start with last)
    this.pointer = this.subData.predictions.length - 1

    // Hot start: TODO: This can be fixed
    this.setupPrediction()
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

  // Marker transition functions
  // ---------------------------

  /**
   * Move time rectangle following the prediction pointer
   */
  moveTimeRect() {
    let xPoint = this.subData.predictions[this.pointer].week % 100
    this.svg.select('.timerect')
      .transition()
      .duration(200)
      .attr('width', this.xScale(xPoint))
  }

  /**
   * Move onset marker
   */
  moveOnset() {
    let svg = this.svg,
        xScale = this.xScale
    let onset = this.subData.predictions[this.pointer].onsetWeek

    svg.select('.onset-mark')
      .transition()
      .duration(200)
      .attr('x', xScale(onset.point) - 4)

    svg.select('.onset-range')
      .transition()
      .duration(200)
      .attr('x1', xScale(onset.low))
      .attr('x2', xScale(onset.high))

    svg.select('.onset-low')
      .transition()
      .duration(200)
      .attr('x1', xScale(onset.low))
      .attr('x2', xScale(onset.low))

    svg.select('.onset-high')
      .transition()
      .duration(200)
      .attr('x1', xScale(onset.high))
      .attr('x2', xScale(onset.high))
  }

  /**
   * Move peak marker
   */
  movePeak() {
    let svg = this.svg,
        xScale = this.xScale,
        yScale = this.yScale
    let pw = this.subData.predictions[this.pointer].peakWeek,
        pp = this.subData.predictions[this.pointer].peakPercent

    svg.select('.peak-mark')
      .transition()
      .duration(200)
      .attr('x', xScale(pw.point) - 4)
      .attr('y', yScale(pp.point) - 4)

    svg.select('.peak-range-x')
      .transition()
      .duration(200)
      .attr('x1', xScale(pw.low))
      .attr('x2', xScale(pw.high))
      .attr('y1', yScale(pp.point))
      .attr('y2', yScale(pp.point))

    svg.select('.peak-range-y')
      .transition()
      .duration(200)
      .attr('x1', xScale(pw.point))
      .attr('x2', xScale(pw.point))
      .attr('y1', yScale(pp.low))
      .attr('y2', yScale(pp.high))

    svg.select('.peak-low-x')
      .transition()
      .duration(200)
      .attr('x1', xScale(pw.low))
      .attr('x2', xScale(pw.low))
      .attr('y1', yScale(pp.point) - 5)
      .attr('y2', yScale(pp.point) + 5)

    svg.select('.peak-high-x')
      .transition()
      .duration(200)
      .attr('x1', xScale(pw.high))
      .attr('x2', xScale(pw.high))
      .attr('y1', yScale(pp.point) - 5)
      .attr('y2', yScale(pp.point) + 5)

    svg.select('.peak-low-y')
      .transition()
      .duration(200)
      .attr('x1', xScale(pw.point) - 5)
      .attr('x2', xScale(pw.point) + 5)
      .attr('y1', yScale(pp.low))
      .attr('y2', yScale(pp.low))

    svg.select('.peak-high-y')
      .transition()
      .duration(200)
      .attr('x1', xScale(pw.point) - 5)
      .attr('x2', xScale(pw.point) + 5)
      .attr('y1', yScale(pp.high))
      .attr('y2', yScale(pp.high))
  }

  /**
   * Move prediction points + area
   */
  movePrediction() {
    let d3 = this.d3,
        xScale = this.xScale,
        yScale = this.yScale,
        svg = this.svg

    let predictionData = this.subData.predictions[this.pointer]
    console.log(predictionData.week)
    let startWeek = predictionData.week,
        startData = this.subData.actual.filter(d => d.week == startWeek)[0].data

    let data = [{
      week: startWeek % 100,
      data: startData,
      low: startData,
      high: startData
    }]

    let names = ['oneWk', 'twoWk', 'threeWk', 'fourWk']
    let weeks = this.getNextWeeks(startWeek)

    names.forEach((item, idx) => {
      data.push({
        week: weeks[idx],
        data: predictionData[item].point,
        low: predictionData[item].low,
        high: predictionData[item].high
      })
    })

    let group = svg.select('.prediction-group')

    // Move circles around
    let circles = group.selectAll('.point-prediction')
        .data(data)

    circles.exit().remove()

    circles.enter().append('circle')
      .merge(circles)
      .attr('class', 'point-prediction')
      .transition()
      .duration(200)
      .ease(d3.easeQuadOut)
      .attr('cx', d => xScale(d.week))
      .attr('cy', d => yScale(d.data))
      .attr('r', 3)

    let line = d3.line()
        .x(d => xScale(d.week % 100))
        .y(d => yScale(d.data))

    group.select('.line-prediction')
      .datum(data)
      .transition()
      .duration(200)
      .attr('d', line)

    let area = d3.area()
        .x(d => xScale(d.week % 100))
        .y1(d => yScale(d.low))
        .y0(d => yScale(d.high))

    group.select('.area-prediction')
      .datum(data)
      .transition()
      .duration(200)
      .attr('d', area)
  }

  /**
   * Move all prediction specific markers
   */
  moveAll() {
    this.moveTimeRect()
    this.moveOnset()
    this.movePeak()
    this.movePrediction()
  }

  /**
   * Increment pointer and redraw
   */
  stepForward() {
    this.pointer = Math.min(this.subData.predictions.length - 1, ++this.pointer)
    this.moveAll()
  }

  /**
   * Decrement pointer and redraw
   */
  stepBackward() {
    this.pointer = Math.max(0, --this.pointer)
    this.moveAll()
  }


  // Utility functions
  // ----------------

  /**
   * Return maximum value to be displayed (y axis) in the given subset
   */
  getSubDataMax(subData) {
    let actualMax = Math.max(...subData.actual.map(d => d.data))
    let predictionHighMax = Math.max(...subData.predictions.map(d => Math.max(...[
      d.oneWk.high,
      d.twoWk.high,
      d.threeWk.high,
      d.fourWk.high,
      d.peakPercent.high])))

    return 1.1 * Math.max(...[actualMax, predictionHighMax])
  }

  /**
   * Return next four week numbers for given week
   */
  getNextWeeks(currentWeek) {
    let current = this.xScale.domain().indexOf(currentWeek % 100)
    let weeks = []
    for (let i = 0; i < 4; i++) {
      current += 1
      weeks.push(this.xScale.domain()[current])
    }
    return weeks
  }
}
