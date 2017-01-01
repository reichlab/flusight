// Utility functions for choropleth family
// ---------------------------------------

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
    if (d.states.indexOf(stateName) === -1) {
      states = states.concat(d.states)
    }
  })

  return states
}
