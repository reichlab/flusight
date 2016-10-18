// Vuex store getters

export function metadata (state) {
  return state.metadata
}

export function selectedModel (state) {
  return state.selected.model
}

export function selectedSeason (state) {
  return state.selected.season
}

export function selectedRegion (state) {
  return state.selected.region
}

export function models (state) {
  // Assuming each region/season has all the models
  return state.data[0].seasons[0].models.map(m => m.id)
}

export function seasons (state) {
  // Assuming each region has all the seasons
  return state.data[0].seasons.map(s => s.id)
}

export function regions (state) {
  return state.data.map(d => d.region)
}

export function chart (state) {
  return state.chart
}

export function map (state) {
  return state.map
}

/**
 * Return data subset for chart as specified in region/season selected
 */
export function chartData (state) {

  let regionSubset = state.data[selectedRegion(state)]
  let seasonSubset = regionSubset.seasons[selectedSeason(state)]
  let modelSubset = seasonSubset.models[selectedModel(state)]

  return {
    region: regionSubset.subId, // Submission ids are concise
    actual: seasonSubset.actual,
    baseline: seasonSubset.baseline,
    predictions: modelSubset.predictions
  }
}

/**
 * Return actual data for all regions for current selection
 */
export function mapData (state) {

  let output = []

  state.data.map(r => {
    output.push({
      region: r.subId,
      states: r.states,
      actual: r.seasons[selectedSeason(state)].actual
    })
  })

  return output.slice(1) // Skip national data
}
