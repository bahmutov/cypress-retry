const cypress = require('cypress')
cypress.run({
  spec: 'cypress/integration/spec.js',
  env: {
    // make the test fail on first attempt
    FAIL: '1'
  }
}).then(results => {
  console.log(results.runs[0].tests)
})
