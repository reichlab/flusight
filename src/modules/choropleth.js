import 'topojson'
import Datamap from 'datamaps/dist/datamaps.usa'
import * as util from './utils/choropleth'
import colormap from 'colormap'
import textures from 'textures'
import * as marker from './markers/choropleth'

// Map interaction functions

// Draw map on given element
// Takes d3 instance
export default class Choropleth {
  constructor(d3, elementId, regionHook) {

    let footBB = d3.select('.footer').node().getBoundingClientRect(),
        chartBB = d3.select('#' + elementId).node().getBoundingClientRect()

    let divWidth = chartBB.width,
        divHeight = window.innerHeight - chartBB.top - footBB.height

    // Initialized datamap
    let datamap = new Datamap({
      element: document.getElementById(elementId),
      scope: 'usa',
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

    // Add hover info div
    this.tooltip = d3.select('body').append('div')
      .attr('id', 'choropleth-hover')
      .style('position', 'fixed')
      .style('display', 'none')

    let svg = d3.select('#' + elementId + ' svg')
        .attr('height', divHeight)
        .attr('width', divWidth)
    this.texture = textures.lines()
    svg.call(this.texture)
    this.width = svg.node().getBoundingClientRect().width
    this.height = svg.node().getBoundingClientRect().height
    this.svg = svg
    this.d3 = d3
    this.cmap = colormap({
      colormap: 'YIOrRd',
      nshades: 50,
      format: 'rgbaString'
    })
    this.regionHook = regionHook
    // Setup color bar
    this.colorBar = new marker.ColorBar(d3, svg, this.cmap)
  }

  /**
   * Plot data on map
   * Triggered on:
   *   - Choropleth selector change
   *   - Season selector change
   */
  plot(data) {

    let d3 = this.d3,
        svg = this.svg,
        cmap = this.cmap,
        regionHook = this.regionHook,
        tooltip = this.tooltip

    let maxData = util.getMaxData(data)

    this.colorScale = d3.scaleLinear()
      .domain([maxData, 0])
      .range([0, cmap.length - 0.01])

    this.colorBar.update([0, maxData])

    let bb = svg.node().getBoundingClientRect()

    // Set on hover items
    d3.selectAll('.datamaps-subunit')
      .on('mouseover', function() {
        d3.selectAll('.datamaps-subunit')
          .filter(d => util.getCousins(this, data)
                  .indexOf(d.id) > -1)
          .style('opacity', '0.4')
        tooltip.style('display', null)
      })
      .on('mouseout', function() {
        d3.selectAll('.datamaps-subunit')
          .filter(d => util.getCousins(this, data)
                  .indexOf(d.id) > -1)
          .style('opacity', '1.0')
        tooltip.style('display', 'none')
      })
      .on('mousemove', function() {
        let mouse = d3.mouse(this)

        tooltip
          .style('top', (mouse[1] + bb.top) + 'px')
          .style('left', (mouse[0] + bb.left + 30) + 'px')
          .html(util.tooltipText(this, data))
      })
      .on('click', function() {
        // Change the region selector
        regionHook(util.getRegionId(util.getSiblings(this, data).region))
      })

    // Save data
    this.data = data
  }

  /**
   * Transition on week change and region highlight
   * Triggered on:
   *   - Week change
   *   - Region selector change
   */
  update(ids) {
    let d3 = this.d3,
        data = this.data,
        colorScale = this.colorScale,
        cmap = this.cmap

    let highlightedStates = [],
        color = null
    if (ids.regionIdx >= 0) {
      highlightedStates = data[ids.regionIdx].states
    }

    // Update colors for given week
    data.map(d => {
      let value = d.value[ids.weekIdx].data
      let colorId =  Math.floor(colorScale(value))
      color = cmap[colorId]

      d.states.map(s => {
        let d3State = d3.select('.' + s) // TODO: Set texture mask

        if (highlightedStates.indexOf(s) > -1) {
          d3State.style('stroke', '#333')
            .style('stroke-opacity', 1)
        } else {
          d3State.style('stroke', 'white')
            .style('stroke-opacity', 0)
        }

        d3State.style('fill', color)
        d3State.attr('data-value', value)
      })
    })
  }
}
