/**
 * Test data.json for schema compliance
 */

/* global describe it */
const chai = require('chai')
const fs = require('fs')

chai.use(require('chai-json-schema'))
chai.should()

describe('Generated data.json', function () {
  it('should comply with ./schema/schema.json', function (done) {
    fs.readFile('./src/assets/data.json', 'utf8', function (err, data) {
      if (err) throw err
      let dataJSON = JSON.parse(data)
      fs.readFile('./schema/schema.json', 'utf8', function (err, data) {
        if (err) throw err
        let schema = JSON.parse(data)
        dataJSON.should.be.jsonSchema(schema)
        done()
      })
    })
  })
})
