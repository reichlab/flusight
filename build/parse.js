// Convert data files for ingestion
// and create static assets in ../src/assets for ingestion

const parse = require('../parse/parse')

console.log('Parsing files...\n')

let dataDirectory = './data',
    configFile = './config.yaml',
    baselineFile = './parse/modules/vendor/wILI_Baseline.csv',
    outputFile = './src/assets/data.json'

parse.process(dataDirectory, () => {
  parse.generate(dataDirectory, configFile, baselineFile, outputFile)
})

