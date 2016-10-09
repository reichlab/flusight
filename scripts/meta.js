// Metadata

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

// List of HHS region objects
const regions = {
  nat: {
    identifier: 'National',
    states: [...Array(states.length).keys()]
  },
  hhs1: {
    identifier: 'Region 1 [CT, MA, ME, NH, RI, VT]',
    states: [6, 19, 21, 30, 39, 46]
  },
  hhs2: {
    identifier: 'Region 2 [NJ, NY]',
    states: [31, 34]
  },
  hhs3: {
    identifier: 'Region 3 [DE, MD, PA, VA, WV]',
    states: [8, 20, 38, 45, 49]
  },
  hhs4: {
    identifier: 'Region 4 [AL, FL, GA, KY, MS, NC, SC, TN]',
    states: [1, 9, 10, 17, 25, 27, 40, 42]
  },
  hhs5: {
    identifier: 'Region 5 [IL, IN, MI, MN, OH, WI]',
    states: [14, 15, 22, 23, 35, 48]
  },
  hhs6: {
    identifier: 'Region 6 [AR, LA, NM, OK, TX]',
    states: [2, 18, 32, 36, 43]
  },
  hhs7: {
    identifier: 'Region 7 [IA, KS, MO, NE]',
    states: [12, 16, 24, 29]
  },
  hhs8: {
    identifier: 'Region 8 [CO, MT, ND, SD, UT, WY]',
    states: [5, 26, 28, 41, 44, 50]
  },
  hhs9: {
    identifier: 'Region 9 [AZ, CA, HI, NV]',
    states: [3, 4, 11, 33]
  },
  hhs10: {
    identifier: 'Region 10 [AK, ID, OR, WA]',
    states: [0, 13, 37, 47]
  }
}

exports.states = states
exports.regions = regions
