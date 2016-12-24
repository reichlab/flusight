/**
 * Reader for history json file
 */

const fs = require('fs')

/**
 * Get historical data
 */
const getHistory = historyFile => {
  if (!fs.existsSync(historyFile)) {
    console.log('History file not found. Run `yarn run get-history` to fetch it')
    process.exit(1)
  }
  return JSON.parse(fs.readFileSync(historyFile, 'utf8'))
}

exports.getHistory = getHistory
