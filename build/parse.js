// Convert data files for ingestion
// and create static assets in ../src/assets for ingestion

const parse = require('../parse/parse')

console.log('Parsing files...\n')

let dataDirectory = './data',
    configFile = './config.yaml',
    baselineFile = './parse/modules/assets/wILI_Baseline.csv',
    historyFile = './parse/modules/assets/history.json',
    outputFile = './src/assets/data.json'

parse.process(dataDirectory, () => {
  parse.generate(dataDirectory,
                 configFile,
                 baselineFile,
                 historyFile,
                 outputFile)
})

