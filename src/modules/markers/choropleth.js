// Markers for choropleth

import * as d3 from 'd3'

export class ColorBar {
  constructor (svg, cmap) {
    let svgBB = svg.node().getBoundingClientRect()

    // Clear
    d3.select('.colorbar-group')
      .remove()

    let group = svg.append('g')
        .attr('class', 'colorbar-group')

    let bar = {
      height: 15,
      width: svgBB.width / 4,
      x: (svgBB.width * 3 / 4) - 20,
      y: svgBB.height - 20
    }

    let eachWidth = bar.width / cmap.length

    // Add rectangles
    for (let i = 0; i < cmap.length; i++) {
      group.append('rect')
        .attr('x', bar.x + i * eachWidth)
        .attr('y', bar.y)
        .attr('height', bar.height)
        .attr('width', eachWidth)
        .style('fill', cmap[cmap.length - 1 - i])
    }

    // Add axis
    let scale = d3.scaleLinear()
        .range([0, bar.width])

    group.append('g')
      .attr('class', 'axis axis-color')
      .attr('transform', 'translate(' + bar.x + ',' + (bar.y - 2) + ')')

    this.svg = svg
    this.scale = scale
  }

  // Update scale of colorbar
  update (range) {
    this.scale.domain(range)

    let axis = d3.axisTop(this.scale)
        .ticks(5)

    this.svg.select('.axis-color')
      .transition()
      .duration(200)
      .call(axis)
  }
}
