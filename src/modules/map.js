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
          .scale(450)
          .translate([element.offsetWidth / 2 - 30, element.offsetHeight / 2 + 20])
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

    let nCmap = 50
    this.cmap = colormap({
      colormap: 'YIOrRd',
      nshades: nCmap,
      format: 'rgbaString'
    })

    let svg = this.d3.select('#' + this.elementId + ' svg')
    this.width = svg.node().getBoundingClientRect().width
    this.height = svg.node().getBoundingClientRect().height
    this.svg = svg
    this.nCmap = nCmap

    this.setupInfo()
    this.setupColorBar()
  }

  /**
   * Add info text + toggle
   */
  setupInfo() {
    let d3 = this.d3
    let group = this.svg.append('g')
        .attr('class', 'info-group')

    group.append('text')
      .attr('class', 'switch')
      .attr('text-andhor', 'start')
      .attr('transform', 'translate(220, 17)')
      .text('\uf205')
      .on('mouseover', function() {
        d3.select(this)
          .style('fill', '#333')
      })
      .on('mouseout', function() {
        d3.select(this)
          .style('fill', '#ccc')
      })
      .on('click', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .text('\uf204')
      })

    group.append('rect')
      .attr('x', 20)
      .attr('y', 0)
      .attr('width', 4)
      .attr('height', 45)
      .style('fill', '#ccc')

    group.append('text')
      .attr('class', 'title')
      .attr('text-anchor', 'start')
      .attr('transform', 'translate(35, 15)')
      .text('Absolute Weighted ILI (%)')

    group.append('text')
      .attr('class', 'sub-title')
      .attr('text-anchor', 'start')
      .attr('transform', 'translate(35, 40)')
      .text('Week 18')
  }

  /**
   * Add color bar to the side
   */
  setupColorBar() {
    let group = this.svg.append('g')
        .attr('class', 'colorbar-group')

    let cb = {
      height: 160,
      width: 20,
      x: this.width - 20,
      y: 100
    },
        barHeight = Math.floor(cb.height / this.nCmap)

    for (let i = 0; i < this.nCmap; i++) {
      group.append('rect')
        .attr('x', cb.x)
        .attr('y', cb.y + i * barHeight)
        .attr('width', cb.width)
        .attr('height', barHeight)
        .style('fill', this.cmap[i])
    }

    // Add axis
    let scale = this.d3.scaleLinear()
        .range([cb.height, 0])
    let axis = this.d3.axisLeft(scale)
        .ticks(5)

    group.append('g')
      .attr('class', 'axis axis-y-color')
      .attr('transform', 'translate(' + cb.x + ',' + cb.y + ')')
      .call(axis)
  }

  /**
   * Plot data on map, iterating only on weeks which are present
   * in the given chart data
   */
  plotData(mapData, predictions, clickCallback) {
    let d3 = this.d3

    // Save data for movement
    this.mapData = mapData
    this.weeks = predictions.map(d => d.week)

    // Set pointer to the last week
    this.pointer = this.weeks.length - 1

    this.colorScale = this.d3.scaleLinear()
      .domain([this.getMaxData(), 0])
      .range([0, 49.99]) // Will take floor for shade

    // On hover color change
    d3.selectAll('.datamaps-subunit')
      .on('mouseover', function() {
        d3.selectAll('.datamaps-subunit')
          .filter(d => getCousins(this, mapData)
                  .indexOf(d.id) > -1)
          .transition()
          .duration(100)
          .style('opacity', '0.4')
      })
      .on('mouseout', function() {
        d3.selectAll('.datamaps-subunit')
          .filter(d => getCousins(this, mapData)
                  .indexOf(d.id) > -1)
          .transition()
          .duration(100)
          .style('opacity', '1.0')
      })
      .on('click', function() {
        // Change the region selector
        clickCallback(getRegionId(getSiblings(this, mapData).region))
      })
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

// Purer utility functions
// -----------------------

/**
 * Return sibling data for given element
 */
const getSiblings = (element, mapData) => {
  let stateName = element.getAttribute('class').split(' ')[1]
  return mapData.filter(d => d.states.indexOf(stateName) > -1)[0]
}

/**
 * Return id mapping to region selector
 */
const getRegionId = (region) => {
  return parseInt(region.split(' ').pop())
}

/**
 * Return non-sibling states
 */
const getCousins = (element, mapData) => {
  let stateName = element.getAttribute('class').split(' ')[1]
  let states = []
  mapData.forEach(d => {
    if (d.states.indexOf(stateName) === - 1) {
      states = states.concat(d.states)
    }
  })

  return states
}
