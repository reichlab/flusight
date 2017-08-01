/**
 * Test the expected data files in ./src/assets/data
 */

/* global describe it */
const chai = require('chai')
const path = require('path')
const fs = require('fs')

chai.should()

describe('History file', function () {
  it('should be generated', function () {
    fs.existsSync('./src/assets/data/history.json').should.be.true
  })
})

describe('Metadata file', function () {
  it('should be generated', function () {
    fs.existsSync('./src/assets/data/metadata.json').should.be.true
  })
})

describe('Season data files', function () {
  it('should be generated', function () {
    // Get a list of seasons from the ./data directory
    let seasons = fs.readdirSync('./data').filter(file => {
      return fs.statSync(path.join('./data', file)).isDirectory()
    })
    seasons[seasons.length - 1] = 'latest'

    seasons.forEach(season => {
      fs.existsSync(`./src/assets/data/season-${season}.json`).should.be.true
    })
  })
})
