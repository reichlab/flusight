// Utility functions for timechart family
// --------------------------------------

/**
 * Return maximum value to be displayed (y axis) in the given subset
 */
export const getYMax = data => {
  let maxValues = [Math.max(...data.actual.map(d => d.data))]

  // Loop over all the models
  data.models.map(mdl => {
    maxValues.push(Math.max(...mdl.predictions.map(d => Math.max(...[
      d.oneWk.high,
      d.twoWk.high,
      d.threeWk.high,
      d.fourWk.high,
      d.peakPercent.high]))))
  })

  return 1.1 * Math.max(...maxValues)
}


/**
 * Return next four week numbers for given week
 */
export const getNextWeeks = (currentWeek, weeks) => {
  let current = weeks.indexOf(currentWeek % 100)
  let nextWeeks = []
  for (let i = 0; i < 4; i++) {
    current += 1
    if (current < weeks.length) nextWeeks.push(weeks[current])
  }
  return nextWeeks
}

/**
 * Return formatted tooltip text for given weekIdx
 */
export const tooltipText = (object, idx) => {
  // Run queries on objects and return html

  var color = object.d3.scaleOrdinal(object.d3.schemeCategory10)

  let text = ''

  // Ask actual
  let actualValue = object.actual.query(idx)
  // if (actualValue) {
  //   text += '<div class="actual" style="background:' + color(0) +  '">Actual <span class="bold">' + actualValue + '</span></div>'
  // }
  // text += '<div class="prediction" style="background:' + color(1) +  '">>KOT <span class="bold">' + actualValue + '</span></div>'

  for (let i = 0; i < 1; i++) {
    text += '<div class="prediction" style="background:' + color(i) +  '">KOT <span class="bold">' + actualValue + '</span></div>'
  }

  return text
}


/**
 * Return rgba for hex
 */
export const hexToRgba = (hex, alpha) => {
  let c = hex.substring(1).split('')

  if (c.length == 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]]
  c = '0x'+c.join('')

  return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')'
}
