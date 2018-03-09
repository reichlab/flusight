// Module for interacting with zoltar

const rp = require('request-promise-native')
const buildUrl = require('build-url')

async function get (url) {
  return rp(url, { json: true })
}

async function gets (url) {
  return rp(url, { json: false })
}

class Zoltar {
  constructor (rootUrl) {
    this.root = rootUrl
  }

  get projects () {
    return (async () => {
      let resp = await get(buildUrl(this.root, { path: 'projects' }))
      return resp.map(projectData => new ZProject(projectData))
    })()
  }
}

class ZProject {
  constructor (projectData) {
    this.name = projectData.name
    this.data = projectData
  }

  get models () {
    return (async () => {
      let resp = await Promise.all(this.data.models.map(m => get(m)))
      return resp.map(modelData => new ZModel(modelData))
    })()
  }
}

class ZModel {
  constructor (modelData) {
    this.name = modelData.name
    this.data = modelData
  }

  get forecasts () {
    return (async () => {
      let resp = await Promise.all(this.data.forecasts.map(f => get(f.forecast)))
      return resp.map(forecastData => new ZForecast(forecastData))
    })()
  }
}

class ZForecast {
  constructor (forecastData) {
    this.data = forecastData
  }

  get csv () {
    return (async () => {
      let resp = await gets(this.data.forecast_data)
      return resp
    })()
  }
}

module.exports.Zoltar = Zoltar
