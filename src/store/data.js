import history from '!json!../assets/data/history.json'
import metadata from '!json!../assets/data/metadata.json'
// Loading latest season in the main bundle itself
import latestSeasonData from '!json!../assets/data/season-latest.json'
import latestDistData from '!json!../assets/data/distributions/season-latest-nat.json'

const seasonDataCtx = require.context(
  'file-loader!../assets/data/',
  false,
  /^\.\/.*\.json$/
)

const distDataCtx = require.context(
  'file-loader!../assets/data/distributions/',
  false,
  /^\.\/.*\.json$/
)

const seasonDataUrls = seasonDataCtx.keys().reduce((acc, key) => {
  if (key.startsWith('./season-')) {
    // Identifier is like '2013-2014'
    acc[key.slice(9, -5)] = seasonDataCtx(key)
  }
  return acc
}, {})

const distDataUrls = distDataCtx.keys().reduce((acc, key) => {
  if (key.startsWith('./season-')) {
    // Identifier is like '2013-2014-hhs10'
    acc[key.slice(9, -5)] = distDataCtx(key)
  }
  return acc
}, {})

export { seasonDataUrls, distDataUrls, latestSeasonData, latestDistData, history, metadata }
