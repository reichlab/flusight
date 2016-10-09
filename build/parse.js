// Convert data files for ingestion
//
// Specifically, tranform ../data and ../config.yaml
// and create static assets in ../src/assets for ingestion

const path = require('path')
const ora = require('ora')
const old2new = require('../scripts/old2new')
const delphiAPI = require('../scripts/delphi_epidata')

var spinner = ora("Reading files...")
spinner.start()

console.log("Not implemented")

spinner.stop()
