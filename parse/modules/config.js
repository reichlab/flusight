// Modules for reading config.yaml file

const yaml = require('js-yaml')
const fs = require('fs')

/**
 * Return object read from config file
 * @param {string} config file
 */
const read = (configFile) => {
  return yaml.safeLoad(fs.readFileSync(configFile, 'utf8'))
}

exports.read = read
