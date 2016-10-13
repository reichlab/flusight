// Vuex store getters

export function metadata (state) {
  return state.metadata
}

export function selectedModel (state) {
  return state.models[state.selected.model]
}

export function selectedSeason (state) {
  return state.seasons[state.selected.season]
}

export function selectedRegion (state) {
  return state.regions[state.selected.region]
}

export function models (state) {
  return state.models
}

export function seasons (state) {
  return state.seasons
}

export function regions (state) {
  return state.regions
}

export function chart (state) {
  return state.chart
}

export function map (state) {
  return state.map
}
