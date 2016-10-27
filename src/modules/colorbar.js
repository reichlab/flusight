// Color bar with the choropleth

export default class ColorBar {
  constructor(d3, cmap, elementId) {
    this.d3 = d3
    this.cmap = cmap
    this.elementId = elementId
    this.setup()
  }

  // Setup color bar on element
  setup() {
    let svg = this.d3.select('#' + this.elementId + ' svg')

    let chartDiv = document.getElementById(this.elementId),
        divWidth = chartDiv.offsetWidth,
        divHeight = chartDiv.offsetHeight

    let group = svg.append('g')
        .attr('class', 'colorbar-group')

    let barHeight = Math.floor(divHeight / this.cmap.length)

    // Add rectangles
    for (let i = 0; i < this.cmap.length; i++) {
      group.append('rect')
        .attr('x', 0)
        .attr('y', 0 + i * barHeight)
        .attr('width', divWidth / 2)
        .style('fill', this.cmap[i])
    }

    // Add axis
    let scale = this.d3.scaleLinear()
        .range([divHeight, 0])

    group.append('g')
      .attr('class', 'axis axis-color')
      .attr('transform', 'translate(' + 0 + ',' + 0 + ')')

    this.svg = svg
    this.scale = scale
  }

  // Update scale of colorbar
  update(range) {
    this.scale.domain(range)

    let axis = this.d3.axisLeft(this.scale)
        .ticks(5)

    this.svg.select('.axis-color')
      .transition()
      .duration(200)
      .call(axis)
  }
}
