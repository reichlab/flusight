/**
 * Download and save baseline file
 */

const fct = require('flusight-csv-tools')
let baselineFile = './scripts/assets/wILI_Baseline.csv'

fct.truth.getBaselineData(baselineFile).then(d => {
  console.log('File dowloaded')
}).catch(e => {
  console.log(e)
})
