import history from '!json!../assets/data/history.json'
import metadata from '!json!../assets/data/metadata.json'
import latestSeasonData from '!json!../assets/data/season-latest.json'

const req = require.context(
  'file-loader!../assets/data/',
  false,
  /^\.\/.*\.json$/
)

const seasonDataUrls = req.keys().reduce((acc, key) => {
  if (key.startsWith('./season-2')) {
    acc[key.slice(9, -5)] = req(key)
  }
  return acc
}, {})

export { seasonDataUrls, latestSeasonData, history, metadata }
