const fs = require('fs')
const { skipAllOtherTests } = require('./skip')
const cypress = require('cypress')
const { map, prop, filter, propEq, tap, head } = require('ramda')
const debug = require('debug')('cypress-retry')
const debugOneLine = x => debug('%o', x)

const specFilename = 'cypress/integration/spec.js'

const rerunOnlyFailedTests = titles => {
  // backup
  const source = fs.readFileSync(specFilename, 'utf8')
  skipAllOtherTests(specFilename, titles)

  return cypress
    .run({
      spec: specFilename
    })
    .finally(() => {
      // always restore the original
      console.log('restoring original spec file %s', specFilename)
      fs.writeFileSync(specFilename, source, 'utf8')
    })
}

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
      const titles = map(prop('title'), failedTests)
      console.log('failed test titles:\n' + titles.join('\n'))
      return rerunOnlyFailedTests(titles)
    }
  })
