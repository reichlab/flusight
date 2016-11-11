// One time data collection tasks
const fs = require('fs')
const download = require('download')

const saveBaseline = (fileName) => {
  let baselineUrl = 'https://raw.githubusercontent.com/cdcepi/FluSight-forecasts/master/wILI_Baseline.csv'
  download(baselineUrl).pipe(fs.createWriteStream(fileName))
}


const saveHistory = (fileName) => {

}

exports.saveBaseline = saveBaseline
exports.saveHistory = saveHistory
