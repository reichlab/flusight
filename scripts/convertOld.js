// Convert old submissions and move to proper place

const old2new = require('./old2new')
const fs = require('fs')
const path = require('path')
const walk = require('walk')

const convert = (dataDirectory, callback) => {
  console.log('Converting old submission files to new format')

  let walker = walk.walk(dataDirectory)

  let oldFile = newFile = null
  walker.on('file', (root, fileStat, next) => {
    if (fileStat.name.endsWith('.old')) {
      oldFile = path.join(root, fileStat.name)
      newFile = oldFile.substr(0, oldFile.length - 4)

      fs.writeFile(newFile,
                   old2new.transform(fs.readFileSync(oldFile, 'utf8')),
                   (err) => {
        if (err) {
          return console.log(err)
        }
      })
    }
    next()
  })
  walker.on('end', () => {
    console.log('Conversion done')
    callback()
  })
}

exports.convert = convert
