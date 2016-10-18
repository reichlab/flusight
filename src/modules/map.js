import 'topojson'
import Datamap from 'datamaps/dist/datamaps.usa.js'

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
        defaultFill: 'rgba(24, 128, 126, 0.9)'
      },
      geographyConfig: {
        highlightOnHover: false,
        popupTemplate: (geo, data) => {
          return ['<div class="hoverinfo">',
                  '<strong>Region X</strong><br>',
                  'Weighted ILI (%): 0',
                  '</div>'].join('')
        }
      }
    })
  }

  plotData(mapData) {
    // Update map with given data
    // TODO: lookout for choropleth absolute max color


    // Save for movements
    this.mapData = mapData
  }
}
