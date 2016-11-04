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
export const tooltipText = (object, idx, y) => {
  // Run queries on objects and return html

  let text = ''

  // Ask actual
  let actualValue = object.actual.query(idx)

  if (actualValue != -1) {
    text += '<div class="actual" style="background:white">Actual <span class="bold">'
    text += actualValue + '</span></div>'
  }

  object.predictions.map(p => {
    let data = p.query(idx)

    if (data) {
      text += '<div class="prediction" style="background:' + p.color +  '">'
      text += p.id + ' <span class="bold">' + data + '</span></div>'
    }
  })

  return text
}

/**
 * Return formatted tooltip info text for points
 */
export const pointTooltip = (id, desc, value, color) => {
  let text = ''

  text += '<div class="point head">' + desc + '</div>'
  text += '<div class="point" style="background:' + color + '">'
  text += id + '<span class="bold">' + value + '</span></div>'

  return text
}

/**
 * Return formatted tooltip info text for legend items
 */
export const legendTooltip = (meta) => {
  let text = ''

  text += '<div class="name">' + meta.name + '</div>'
  text += '<div class="desc">' + meta.description + '</div>'

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
