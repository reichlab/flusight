import 'topojson'
import Datamap from 'datamaps/dist/datamaps.usa'
import * as util from './utils/choropleth'
import colormap from 'colormap'
import * as marker from './markers/choropleth'
import textures from 'textures'
import tinycolor from 'tinycolor2'
import * as d3 from 'd3'

// Map interaction functions

// Draw map on given element
// Takes d3 instance
export default class Choropleth {
  constructor (elementId, regionHook) {
    let footBB = d3.select('.footer').node().getBoundingClientRect()
    let chartBB = d3.select('#' + elementId).node().getBoundingClientRect()

    let divWidth = chartBB.width
    let divHeight = window.innerHeight - chartBB.top - footBB.height

    // Padding offsets
    divHeight -= 60

    // Limits
    divHeight = Math.min(Math.max(200, divHeight), 300)
    divWidth = Math.min(divWidth, 400)

    // Initialized datamap
    this.datamap = new Datamap({
      element: document.getElementById(elementId),
      scope: 'usa',
      height: divHeight,
      setProjection: (element, options) => {
        let projection = d3.geoAlbersUsa()
            .scale(divWidth)
            .translate([divWidth / 2, divHeight / 2])
        return {
          path: d3.geoPath().projection(projection),
          projection: projection
        }
      },
      fills: {
        defaultFill: '#ccc'
      },
      geographyConfig: {
        highlightOnHover: false,
        popupOnHover: false
      }
    })

    this.tooltip = d3.select('#choropleth-tooltip')
      .style('display', 'none')

    let svg = d3.select('#' + elementId + ' svg')
        .attr('height', divHeight)
        .attr('width', divWidth)

    this.selectedTexture = textures.lines()
      .size(10)
      .background('white')
    svg.call(this.selectedTexture)

    // Override datamaps css
    d3.select('#' + this.selectedTexture.id() + ' path')
      .style('stroke-width', '1px')

    this.width = svg.node().getBoundingClientRect().width
    this.height = svg.node().getBoundingClientRect().height
    this.svg = svg
    this.regionHook = regionHook
  }

  /**
   * Plot data on map
   * Triggered on:
   *   - Choropleth selector change
   *   - Season selector change
   */
  plot (data) {
    let svg = this.svg
    let regionHook = this.regionHook
    let tooltip = this.tooltip

    let minData = data.range[0]
    let maxData = data.range[1]

    let limits = []
    let barLimits = []

    if (data.type === 'sequential') {
      // Set a 0 to max ranged colorscheme
      this.cmap = colormap({
        colormap: 'YIOrRd',
        nshades: 50,
        format: 'rgbaString'
      })

      limits = [maxData, 0]
      barLimits = [0, maxData]
    } else if (data.type === 'diverging') {
      this.cmap = colormap({
        colormap: 'RdBu',
        nshades: 50,
        format: 'rgbaString'
      }).reverse()

      let extreme = Math.max(Math.abs(maxData), Math.abs(minData))

      limits = [extreme, -extreme]
      barLimits = [-extreme, extreme]
    }

    this.colorScale = d3.scaleLinear()
      .domain(limits)
      .range([0, this.cmap.length - 0.01])

    // Setup color bar
    this.colorBar = new marker.ColorBar(svg, this.cmap)
    this.colorBar.update(barLimits)

    // Set on hover items
    d3.selectAll('.datamaps-subunit')
      .on('mouseover', function () {
        d3.selectAll('.datamaps-subunit')
          .filter(d => util.getCousins(this, data.data)
                  .indexOf(d.id) > -1)
          .style('opacity', '0.4')
        tooltip.style('display', null)
      })
      .on('mouseout', function () {
        d3.selectAll('.datamaps-subunit')
          .filter(d => util.getCousins(this, data.data)
                  .indexOf(d.id) > -1)
          .style('opacity', '1.0')
        tooltip.style('display', 'none')
      })
      .on('mousemove', function () {
        tooltip
          .style('top', (d3.event.pageY + 15) + 'px')
          .style('left', (d3.event.pageX + 15) + 'px')

        let stateName = this.getAttribute('class').split(' ')[1]
        let region = data.data
            .filter(d => (d.states.indexOf(stateName) > -1))[0].region
        let value = data.decorator(parseFloat(this.getAttribute('data-value'))
                                   .toFixed(2))
        tooltip.select('.value').text(value)
        tooltip.select('.region').text(region + ' : ' + stateName)
      })
      .on('click', function () {
        // Change the region selector
        regionHook(util.getRegionId(util.getSiblings(this, data.data).region))
      })

    // Save data
    this.data = data.data
  }

  /**
   * Transition on week change and region highlight
   * Triggered on:
   *   - Week change
   *   - Region selector change
   */
  update (ids) {
    let data = this.data
    let colorScale = this.colorScale
    let selectedTexture = this.selectedTexture
    let cmap = this.cmap

    let highlightedStates = []
    if (ids.regionIdx >= 0) {
      highlightedStates = data[ids.regionIdx].states
    }

    // Update colors for given week
    data.map(d => {
      let value = d.value[ids.weekIdx].data
      let color = '#ccc'
      if (value !== -1) color = cmap[Math.floor(colorScale(value))]

      d.states.map(s => {
        let d3State = d3.select('.' + s)

        d3State.style('fill', color)
        d3State.attr('data-value', value)

        if (highlightedStates.indexOf(s) > -1) {
          // Setup selected pattern
          let strokeColor = tinycolor(color).getLuminance() < 0.5
              ? 'white' : '#444'

          d3.select('#' + selectedTexture.id() + ' rect')
            .attr('fill', color)

          d3.select('#' + selectedTexture.id() + ' path')
            .style('stroke', strokeColor)

          d3State.style('stroke', strokeColor)
            .style('stroke-opacity', 1)
            .style('fill', selectedTexture.url())
        } else {
          d3State.style('stroke', 'white')
            .style('stroke-opacity', 0)
        }
      })
    })
  }
}
