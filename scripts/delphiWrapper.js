// Wrapper around delphi-epidata API (https://github.com/undefx/delphi-epidata)
// for getting actual flu data

const delphiAPI = require('./delphi_epidata')
const meta = require('./meta')

const regionIdentifiers = meta.regions.map(x => x.id)

// Return weighted ili % for all regions for given range
// Range accepted as epiweek number (like 201501)
// TODO: Manage multiple seasons
const getActual = (from, to, callback) => {

  let filterResults = function(result, message, epidata) {
    let output = {}
    regionIdentifiers.forEach(id => {
      output[id] = []
    })

    epidata.forEach(data => {
      output[data['region']].push([data['epiweek'], data['wili']])
    })

    callback(output)
  }

  delphiAPI.Epidata.fluview(filterResults,
                            regionIdentifiers,
                            [delphiAPI.Epidata.range(from, to)])
}

exports.getActual = getActual
