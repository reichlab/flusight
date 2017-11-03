import * as d3 from 'd3'

export default class SeverityChart {
  /**
   * The constructor takes in id of the element to draw on
   */
  constructor (elementId) {
    this.elem = d3.select(elementId)
    // Clear div
    this.elem.selectAll('*').remove()

    let chartBB = this.elem.node().getBoundingClientRect()
    let divWidth = chartBB.width
    let divHeight = 480

    let margin = {
      top: 5,
      right: 50,
      bottom: 70,
      left: 55
    }

    // Create blank chart
    this.width = divWidth - margin.left - margin.right
    this.height = divHeight - margin.top - margin.bottom

    this.svg = this.elem.append('svg')
      .attr('width', divWidth)
      .attr('height', divHeight)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
  }

  /**
   * Called every time there is a redraw, which happens when:
   * - User changes a season or region
   * - User clicks on the severity tab
   *
   * It receives the following data:
   * data = {
   *   timePoints: Array of Objects with mmwr week and year
   *               For a season 20xx-20yy, it goes something like
   *               [{week: 30, year: 20xx},
   *                {week: 31, year: 20xx}
   *                ...
   *                {week: 52, year: 20xx}
   *                {week: 1, year: 20yy}
   *                ...
   *                {week: 29, year: 20yy}
   *                ]
   *   thresholds: Array of 3 numbers (increasing) specifying the threshold
   *               values for wILI%
   *   models: Array of model predictions. Each item corresponds to a model Object
   *           and has many properties. The important ones are id (string; model id)
   *           and predictions (array of 52/53 predictions). Its easier to console.log
   *           it out or inspect via the Vue browser addon's Vuex tab
   *           (look for `severityChartData` in getters section).
   * }
   */
  plot (data) {
    this.data = data

    // Tests
    // You should be able to see these text below the blank svg in severity tab
    this.elem.selectAll('div').remove()
    this.elem.append('div').text(`I got ${data.thresholds} as thresholds. Also data from ${data.models.length} models working for ${data.timePoints.length} weeks.`)
  }

  /**
   * Called on every week update, the argument is the current week index
   * (something from 0,...51/52, depending on the number of mmwr weeks in year)
   */
  update (idx) {
    this.elem.selectAll('h1').remove()
    this.elem.append('h1').text(`On week index ${idx}`)
  }
}
