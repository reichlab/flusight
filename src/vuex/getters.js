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
