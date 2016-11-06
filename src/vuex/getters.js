// Vuex store getters

export function metadata (state) {
  return state.metadata
}

export function selectedSeason (state) {
  return state.selected.season
}

export function selectedRegion (state) {
  return state.selected.region
}

export function selectedWeekIdx (state) {
  return state.selected.week.idx
}

export function selectedWeekName (state) {
  return state.selected.week.name
}

export function selectedChoropleth (state) {
  return state.selected.choropleth
}

export function seasons (state) {
  // Assuming each region has all the seasons
  return state.data[0].seasons.map(s => s.id)
}

export function regions (state) {
  return state.data.map(d => d.region)
}

export function choropleths (state) {
  // TODO: Parse from data
  return ['Actual Weighted ILI (%)']
}

export function timeChart (state) {
  return state.timeChart
}

export function choropleth (state) {
  return state.choropleth
}

/**
 * Return data subset for chart as specified in region/season selected
 */
export function timeChartData (state) {

  let regionSubset = state.data[selectedRegion(state)]
  let currentSeasonId = selectedSeason(state)
  let seasonSubset = regionSubset.seasons[currentSeasonId]

  let historicalData = []

  let selectedWeeksCount = seasonSubset.actual.length

  for (let i = 0; i < currentSeasonId; i++) {
    // Make a copy
    let historyActual = regionSubset.seasons[i].actual.slice(0)
    // Check week counts for coherence
    if (selectedWeeksCount == 52) {
      // Clip everyone else to remove 53rd week
      historyActual = historyActual.filter(d => d.week % 100 != 53)
    } else if (historyActual.length == 52) {
      // Expand to add 53rd week
      // Adding a dummy year 1000, this will also help identify the adjustment
      historyActual.splice(23, 0, {
        week: 100053,
        data: (historyActual[22].data + historyActual[23].data) / 2.0
      })
    }
    historicalData.push({
      id: regionSubset.seasons[i].id,
      actual: historyActual
    })
  }

  return {
    region: regionSubset.subId, // Submission ids are concise
    actual: seasonSubset.actual,
    baseline: seasonSubset.baseline,
    models: seasonSubset.models, // All model predictions
    history: historicalData
  }
}

/**
 * Return formatted next week data
 */
export function nextWeek (state) {
  return timeChart(state).getNextWeekData()
}

/**
 * Return formatted previous week data
 */
export function previousWeek (state) {
  return timeChart(state).getPreviousWeekData()
}

/**
 * Return actual data for all regions for current selections
 */
export function choroplethData (state) {

  // TODO: Handle choropleth selector
  let choroplethId = selectedChoropleth(state),
      seasonId = selectedSeason(state)

  let output = []
  state.data.map(r => {
    output.push({
      region: r.subId,
      states: r.states,
      value: r.seasons[selectedSeason(state)].actual
    })
  })

  return output.slice(1) // Skip national data
}
