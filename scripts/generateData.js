// Generate json data for visualization

const delphiWrapper = require('./delphiWrapper')
const meta = require('./meta')
const old2new = require('./old2new')
const new2json = require('./new2json')
const fs = require('fs')
const path = require('path')


const getSeasons = (directory) => {
  return fs.readdirSync(directory).filter(file => {
    return fs.statSync(path.join(directory, file)).isDirectory()
  })
}

// Generate json data using submissions files in the given dir
const generate = (directory, callback) => {

  let output = {}

  let seasons = getSeasons
  // TODO: Get actual season data using delphiWrapper

  let filename = path.join(directory, 'Long_Flu_Submission_Template_final.csv')
  let transformed = new2json.transform(fs.readFileSync(filename, "utf8"))

  callback()
}

exports.generate = generate
