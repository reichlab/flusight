// Read history file

const fs = require('fs')

/**
 * Get historical data
 */
const getHistory = (historyFile) => JSON.parse(fs.readFileSync(historyFile, 'utf8'))

exports.getHistory = getHistory

