import 'topojson'
import Datamap from 'datamaps/dist/datamaps.usa.js'
import colormap from 'colormap'

// Map interaction functions

// Draw map on given element
// Takes d3 instance
export default class Map {
  constructor(d3, elementId) {
    this.d3 = d3
    this.elementId = elementId
    this.setup()
  }

  // Display the map for the first time
  setup() {
    this.datamap = new Datamap({
      element: document.getElementById(this.elementId),
      scope: 'usa',
      setProjection: (element, options) => {
        let projection = this.d3.geoAlbersUsa()
          .scale(500)
          .translate([element.offsetWidth / 2, element.offsetHeight / 2])
        return {
          path: this.d3.geoPath().projection(projection),
          projection: projection
        }
      },
      fills: {
        defaultFill: '#ccc'
      },
      geographyConfig: {
        highlightOnHover: false,
        popupTemplate: (geo, data) => {
          return ['<div class="hoverinfo">',
                  '<strong>State</strong><br>',
                  '<strong>Region</strong><br>',
                  'Weighted ILI (%)',
                  '</div>'].join('')
        }
      }
    })

    this.cmap = colormap({
      colormap: 'YIOrRd',
      nshades: 50,
      format: 'rgbaString'
    })
  }

  /**
   * Plot data on map, iterating only on weeks which are present
   * in the given chart data
   */
  plotData(mapData, predictions) {

    // Save data for movement
    this.mapData = mapData
    this.weeks = predictions.map(d => d.week)

    // Set pointer to the last week
    this.pointer = this.weeks.length - 1

    this.colorScale = this.d3.scaleLinear()
      .domain([this.getMaxData(), 0])
      .range([0, 49.99]) // Will take floor for shade
  }

  /**
   * Update choropleth
   */
  update() {
    let data = this.getPointerData()

    Object.keys(data).forEach((key) => {
      let colorId =  Math.floor(this.colorScale(data[key].data))

      d3.select('.' + key)
        .transition()
        .duration(100)
        .style('fill', this.cmap[colorId])
    })

    // Save data for hover things
    this.pointerData = data
  }

  /**
   * Increment pointer and redraw
   */
  stepForward() {
    this.pointer = Math.min(this.weeks.length - 1, ++this.pointer)
    this.update()
  }

  /**
   * Decrement pointer and redraw
   */
  stepBackward() {
    this.pointer = Math.max(0, --this.pointer)
    this.update()
  }

  // Utility functions
  // -----------------

  /**
   * Return max value in the current season
   */
  getMaxData() {
    return Math.max(...this.mapData.map(md => {
      return Math.max(...md.actual.filter(d => {
        return this.weeks.indexOf(d.week) > -1
      }).map(d => d.data))
    }))
  }

  /**
   * Get data at pointer
   */
  getPointerData() {
    let week = this.weeks[this.pointer]

    let output = {}

    this.mapData.map(md => {
      md.states.map(s => {
        output[s] = {
          region: md.region,
          data: md.actual.filter(d => d.week == week)[0].data
        }
      })
    })

    return output
  }
}
