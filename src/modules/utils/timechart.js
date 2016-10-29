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
