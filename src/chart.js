// Chart plotting functions

export default class Chart {
  constructor(d3, elementId) {
    this.d3 = d3
    this.elementId = elementId
    this.render()
  }

  // Draw the chart for first time
  render() {
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

    let line = d3.line()
      .x(d => xScale(d.week))
        .y(d => yScale(d.value))

    // Add svg
    let svg = d3.select('#chart').append('svg')
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

    let focus = svg.append('g')
      .attr('class', 'focus')
        .style('display', 'none')

    focus.append('circle')
      .attr('r', 4.5)

    focus.append('text')
      .attr('x', 9)
      .attr('dy', '0.35em')

    focus.append('path')
      .attr('d', d3.line()
            .x(d => 1)
            .y(d => 1)([0]))

    svg.append('rect')
      .attr('class', 'overlay')
      .attr('width', width)
      .attr('height', height)
      .on('mouseover', () => {
        focus.style('display', null)
      })
      .on('mouseout', () => {
        focus.style('display', 'none')
      })
      .on('mousemove', function() {
        let x0 = xScale.invert(d3.mouse(this)[0])
        focus.attr('transform', 'translate(' + xScale(x0) + ',' + 20 + ')')
        focus.select('text').text('' + parseInt(x0))
      })
  }
}
