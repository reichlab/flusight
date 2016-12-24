/**
 * Download and save baseline file
 */

const fs = require('fs')
const download = require('download')

const config = require('./config').read('./config.yaml')

let baselineUrl = config.scripts.baselineUrl
let baselineFile = './scripts/assets/wILI_Baseline.csv'

console.log('Downloading baseline file')
download(baselineUrl).pipe(fs.createWriteStream(baselineFile))
