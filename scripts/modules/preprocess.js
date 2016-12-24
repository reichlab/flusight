/**
 * Preprocess data directory
 */

const fs = require('fs')
const path = require('path')
const walk = require('walk')
const transform = require('./transform')

/**
 * Convert all *.csv.wide files to *.csv
 * @param {string} dataDirectory directory with data files
 * @param {function} callback function to call after completion
 */
const processWide = (dataDirectory, callback) => {
  let walker = walk.walk(dataDirectory)

  let wideFile = null
  let longFile = null
  let transformed = null
  walker.on('file', (root, fileStat, next) => {
    if (fileStat.name.endsWith('.wide')) {
      wideFile = path.join(root, fileStat.name)
      longFile = wideFile.substr(0, wideFile.length - 5)
      transformed = transform.wideToLong(fs.readFileSync(wideFile, 'utf8'))
      fs.writeFileSync(longFile, transformed, 'utf8')
    }
    next()
  })
  walker.on('end', () => {
    callback()
  })
}

exports.processWide = processWide
