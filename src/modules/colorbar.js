// Color bar with the choropleth

export default class ColorBar {
  constructor(d3, cmap, elementId) {
    let svg = d3.select('#' + elementId).append('svg')

    let chartDiv = document.getElementById(elementId),
        divWidth = chartDiv.offsetWidth,
        divHeight = chartDiv.offsetHeight

    let group = svg.append('g')
        .attr('class', 'colorbar-group')

    let bar = {
      height: 0.7 * divHeight,
      width: divWidth / 3,
      x: divWidth * 3 / 5,
      y: 0.15 * divHeight
    }

    let eachHeight = bar.height / cmap.length

    // Add rectangles
    for (let i = 0; i < cmap.length; i++) {
      group.append('rect')
        .attr('x', bar.x)
        .attr('y', bar.y + i * eachHeight)
        .attr('height', eachHeight)
        .attr('width', bar.width)
        .style('fill', cmap[i])
    }

    // Add axis
    let scale = d3.scaleLinear()
        .range([bar.height, 0])

    group.append('g')
      .attr('class', 'axis axis-color')
      .attr('transform', 'translate(' + divWidth / 2 + ',' + bar.y + ')')

    this.d3 = d3
    this.svg = svg
    this.scale = scale
  }

  // Update scale of colorbar
  calibrate(range) {
    this.scale.domain(range)

    let axis = this.d3.axisLeft(this.scale)
        .ticks(5)

    this.svg.select('.axis-color')
      .transition()
      .duration(200)
      .call(axis)
  }
}
