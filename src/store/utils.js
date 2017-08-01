// Utilities

/**
 * Return values scaled by baseline
 */
export const baselineScale = (values, baseline) => {
  return values.map(d => {
    return {
      week: d.week,
      data: baseline ? ((d.data / baseline) - 1) * 100 : -1
    }
  })
}

/**
 * Get data with maximum lag
 * First element of the lag array
 */
export const getMaxLagData = actual => {
  return actual.map(d => {
    let dataToReturn = null
    // Handle zero length values
    if (d.data.length !== 0) {
      dataToReturn = d.data[0].value
    }
    return {
      week: d.week,
      data: dataToReturn
    }
  })
}

/**
 * Trim history data to fit in length 'numWeeks'
 */
export const trimHistory = (historyActual, numWeeks) => {
  let historyTrimmed = historyActual.slice()

  if (numWeeks === 52) {
    // Clip everyone else to remove 53rd week
    historyTrimmed = historyTrimmed.filter(d => d.week % 100 !== 53)
  } else if (historyTrimmed.length === 52) {
    // Expand to add 53rd week
    // Adding a dummy year 1000, this will also help identify the adjustment
    historyTrimmed.splice(23, 0, {
      week: 100053,
      data: (historyTrimmed[22].data + historyTrimmed[23].data) / 2.0
    })
  }

  return historyTrimmed.map(d => d.data)
}

/**
 * Return range for choropleth color scale
 */
export const choroplethDataRange = (seasonsData, relativeToggle) => {
  let maxVals = []
  let minVals = []

  seasonsData.map(seasonData => {
    seasonData.regions.map(regionData => {
      let actual = getMaxLagData(regionData.actual).map(d => d.data).filter(d => d)

      if (relativeToggle) {
        // Use baseline scaled data
        maxVals.push(Math.max(...actual.map(d => ((d / regionData.baseline) - 1) * 100)))
        minVals.push(Math.min(...actual.map(d => ((d / regionData.baseline) - 1) * 100)))
      } else {
        maxVals.push(Math.max(...actual))
        minVals.push(Math.min(...actual))
      }
    })
  })

  return [Math.min(...minVals), Math.max(...maxVals)]
}
