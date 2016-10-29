import 'topojson'
import Datamap from 'datamaps/dist/datamaps.usa'
import * as util from './utils/choropleth'
import colormap from 'colormap'

// Map interaction functions

// Draw map on given element
// Takes d3 instance
export default class Choropleth {
  constructor(d3, elementId, regionHook) {

    let datamap = new Datamap({
      element: document.getElementById(elementId),
      scope: 'usa',
      setProjection: (element, options) => {
        let projection = d3.geoAlbersUsa()
          .scale(element.offsetWidth)
          .translate([element.offsetWidth / 2, element.offsetHeight / 2])
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

    let svg = d3.select('#' + elementId + ' svg')
    this.width = svg.node().getBoundingClientRect().width
    this.height = svg.node().getBoundingClientRect().height
    this.svg = svg
    this.d3 = d3
    this.cmap = colormap({
      colormap: 'YIOrRd',
      nshades: 50,
      format: 'rgbaString'
    })
  }

  /**
   * Plot data on map
   * Triggered on:
   *   - Choropleth selector change
   *   - Season selector change
   */
  plot(data) {

    let d3 = this.d3,
        cmap = this.cmap
    // On hover color change
    d3.selectAll('.datamaps-subunit')
      .on('mouseover', function() {
        d3.selectAll('.datamaps-subunit')
          .filter(d => util.getCousins(this, data)
                  .indexOf(d.id) > -1)
          .transition()
          .duration(100)
          .style('opacity', '0.4')
      })
      .on('mouseout', function() {
        d3.selectAll('.datamaps-subunit')
          .filter(d => util.getCousins(this, data)
                  .indexOf(d.id) > -1)
          .transition()
          .duration(100)
          .style('opacity', '1.0')
      })
      .on('click', function() {
        // Change the region selector
        regionHook(util.getRegionId(util.getSiblings(this, data).region))
      })


    this.colorScale = d3.scaleLinear()
      .domain([util.getMaxData(data), 0])
      .range([0, cmap.length - 0.01])

    data.map(d => {
      let colorId =  Math.floor(this.colorScale(d.value))

      d.states.map(s => {
        d3.select('.' + s)
          .transition()
          .duration(100)
          .style('fill', cmap[colorId])
      })
    })
  }

  /**
   * Transition on week change and region highlight
   * Triggered on:
   *   - Week change
   *   - Region selector change
   */
  update() {
    //
  }
}
