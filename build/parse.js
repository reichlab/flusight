// Convert data files for ingestion
//
// Specifically, tranform ../data and ../config.yaml
// and create static assets in ../src/assets for ingestion

const generateData = require('../scripts/generateData')
const convertOld = require('../scripts/convertOld')

console.log('Parsing files...\n')

let dataDirectory = './data',
    outputFile = './src/assets/data.json'

convertOld.convert(
  dataDirectory,
  () => generateData.generate(dataDirectory, outputFile)
)
