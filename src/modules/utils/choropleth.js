// Utility functions for choropleth family
// ---------------------------------------

/**
 * Return max value in the current season
 */
export const getMaxData = data => Math.max(...data.map(d => Math.max(...d.value.map(dd => dd.data))))

/**
 * Return sibling data for given element
 */
export const getSiblings = (element, data) => {
  let stateName = element.getAttribute('class').split(' ')[1]
  return data.filter(d => d.states.indexOf(stateName) > -1)[0]
}

/**
 * Return id mapping to region selector
 */
export const getRegionId = region => parseInt(region.split(' ').pop())

/**
 * Return non-sibling states
 */
export const getCousins = (element, data) => {
  let stateName = element.getAttribute('class').split(' ')[1]
  let states = []
  data.forEach(d => {
    if (d.states.indexOf(stateName) === - 1) {
      states = states.concat(d.states)
    }
  })

  return states
}

/**
 * Return formatted html for tooltip
 */
export const tooltipText = (element, data) => {
  let stateName = element.getAttribute('class').split(' ')[1],
      region = data.filter(d => (d.states.indexOf(stateName) > -1))[0].region,
      value = element.getAttribute('data-value')

  return '<div class="value">' + value + '</div>' +
    '<div>' + region + ' : ' + stateName + '</div>'
}
