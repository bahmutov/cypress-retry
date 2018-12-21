const { skipAllOtherTests } = require('./skip')
const cypress = require('cypress')
const { map, prop, filter, propEq, tap, head } = require('ramda')
const debug = require('debug')('cypress-retry')
const debugOneLine = x => debug('%o', x)

const specFilename = 'cypress/integration/spec.js'

cypress
  .run({
    spec: specFilename,
    env: {
      // make the test fail on first attempt
      FAIL: '1'
    }
  })
  .then(tap(debugOneLine))
  .then(prop('runs'))
  .then(head)
  .then(first => {
    if (first.stats.failures) {
      console.log('failures: %d', first.stats.failures)
      const failedTests = filter(propEq('state', 'failed'), first.tests)
      console.log(
        'failed test titles:\n' + map(prop('title'), failedTests).join('\n')
      )
    }
  })
