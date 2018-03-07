// Script to download files from zoltar

const fs = require('fs-extra')
const moment = require('moment')
const mmwr = require('mmwr-week')
const zoltar = require('./zoltar')

// Config
const config = require('./config')

async function fileExists (filePath) {
  return fs.pathExists(filePath)
}

async function downloadFile (url, outputFile) {
  // TODO
}

function fileNameTransformer (zolterFile) {
  // TODO Parse the date thing
  let parsedDate
  let mdate = new mmwr.MMWRDate(0, 0)
  mdate.fromMomentDate(moment(parsedData))

  // TODO
  return localFile
}

let z = zoltar.Zoltar(config['zoltar-root'])
let project = z.getProject(config['project'])

let models = project.getModels()

// For each model, check if we have files
