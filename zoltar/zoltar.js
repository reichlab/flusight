// Module for interacting with zoltar

const rp = require('request-promise-native')
const buildUrl = require('build-url')

async function get (url) {
  return rp(url, { json: true })
}

async function gets (url) {
  return rp(url, { json: false })
}

function proxifyObject (obj, root) {
  let handler = {
    get(target, propKey, receiver) {
      let value = target[propKey]

      if (typeof value === 'string' && (value.toString()).startsWith(root)) {
        return (async () => {
          let resp = await get(value)
          return proxifyObject(resp, root)
        })()
      } else if (typeof value === 'object') {
        return proxifyObject(value, root)
      } else  {
        return value
      }
    }
  }

  return new Proxy(obj, handler)
}

function zoltar (rootUrl) {
  let baseObject = {
    projects: `${rootUrl}/projects`
  }
  return proxifyObject(baseObject, rootUrl)
}

module.exports.zoltar = zoltar
