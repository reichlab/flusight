// Collect and save data


const gather = require('../parse/gather')

let baselineFile = './parse/modules/assets/wILI_Baseline.csv',
    historyFile = './parse/modules/assets/history.json'

console.log('Collecting baseline data...\n')
gather.saveBaseline(baselineFile)

console.log('Collecting historical data...\n')
gather.saveHistory(historyFile)
