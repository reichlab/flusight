/**
 * Read and provide config from config.yaml
 */

const yaml = require('js-yaml')
const fs = require('fs')
const read = configFile => yaml.safeLoad(fs.readFileSync(configFile, 'utf8'))

exports.read = read
