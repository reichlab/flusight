// Convert new format submission file to json structure for app
// Pipe in the csv content and it spits the json on stdout
// e.g.
// cat 'old.csv' | node old2new.js | node new2json.js

const Papa = require('papaparse')

let input = ''

process.stdin.resume()
process.stdin.setEncoding('utf8')

process.stdin.on('data', (chunk) => {
  input += chunk
})

process.stdin.on('end', () => {
  process.stdout.write(transform(input))
})

const transform = (oldFormat) => {
  let newFormat = oldFormat
  return newFormat
}
