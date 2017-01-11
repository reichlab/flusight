/** Metadata
 * This connects the state ids used in visualization and submission csvs
 */

// List of US states
const states = ['AK', 'AL', 'AR', 'AZ', 'CA', // 0-4
  'CO', 'CT', 'DC', 'DE', 'FL', // 5-9
  'GA', 'HI', 'IA', 'ID', 'IL', // 10-14
  'IN', 'KS', 'KY', 'LA', 'MA', // 15-19
  'MD', 'ME', 'MI', 'MN', 'MO', // 20-24
  'MS', 'MT', 'NC', 'ND', 'NE', // 25-29
  'NH', 'NJ', 'NM', 'NV', 'NY', // 30-34
  'OH', 'OK', 'OR', 'PA', 'RI', // 35-39
  'SC', 'SD', 'TN', 'TX', 'UT', // 40-44
  'VA', 'VT', 'WA', 'WI', 'WV', 'WY'] // 45-50

// HHS region objects
// id: Short id used by delphi-API
// subId : Used as region identifier in csvs and displayed in visualization
// region : Descriptive text. Not used anywhere as of now.
const regions = [
  {
    id: 'nat',
    subId: 'US National',
    region: 'National',
    states: [...Array(states.length).keys()].map(i => states[i])
  },
  {
    id: 'hhs1',
    subId: 'HHS Region 1',
    region: 'Region 1 [CT, MA, ME, NH, RI, VT]',
    states: [6, 19, 21, 30, 39, 46].map(i => states[i])
  },
  {
    id: 'hhs2',
    subId: 'HHS Region 2',
    region: 'Region 2 [NJ, NY]',
    states: [31, 34].map(i => states[i])
  },
  {
    id: 'hhs3',
    subId: 'HHS Region 3',
    region: 'Region 3 [DE, MD, PA, VA, WV]',
    states: [8, 20, 38, 45, 49].map(i => states[i])
  },
  {
    id: 'hhs4',
    subId: 'HHS Region 4',
    region: 'Region 4 [AL, FL, GA, KY, MS, NC, SC, TN]',
    states: [1, 9, 10, 17, 25, 27, 40, 42].map(i => states[i])
  },
  {
    id: 'hhs5',
    subId: 'HHS Region 5',
    region: 'Region 5 [IL, IN, MI, MN, OH, WI]',
    states: [14, 15, 22, 23, 35, 48].map(i => states[i])
  },
  {
    id: 'hhs6',
    subId: 'HHS Region 6',
    region: 'Region 6 [AR, LA, NM, OK, TX]',
    states: [2, 18, 32, 36, 43].map(i => states[i])
  },
  {
    id: 'hhs7',
    subId: 'HHS Region 7',
    region: 'Region 7 [IA, KS, MO, NE]',
    states: [12, 16, 24, 29].map(i => states[i])
  },
  {
    id: 'hhs8',
    subId: 'HHS Region 8',
    region: 'Region 8 [CO, MT, ND, SD, UT, WY]',
    states: [5, 26, 28, 41, 44, 50].map(i => states[i])
  },
  {
    id: 'hhs9',
    subId: 'HHS Region 9',
    region: 'Region 9 [AZ, CA, HI, NV]',
    states: [3, 4, 11, 33].map(i => states[i])
  },
  {
    id: 'hhs10',
    subId: 'HHS Region 10',
    region: 'Region 10 [AK, ID, OR, WA]',
    states: [0, 13, 37, 47].map(i => states[i])
  }
]

exports.regions = regions
