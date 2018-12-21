const falafel = require('falafel')
const fs = require('fs')
const R = require('ramda')

const isTestBlock = name => node => {
  return (
    node.type === 'CallExpression' &&
    node.callee &&
    node.callee.type === 'Identifier' &&
    node.callee.name === name
  )
}

const isDescribe = isTestBlock('describe')

const isContext = isTestBlock('context')

const isIt = isTestBlock('it')

const getItsName = node => node.arguments[0].value

const skipAllOtherTests = (specFilename, leaveTests) => {
  const source = fs.readFileSync(specFilename, 'utf8')

  const shouldLeaveTest = testName => leaveTests.some(R.equals(testName))

  const findSuites = (node, names = []) => {
    if (!node) {
      return
    }

    if (isDescribe(node) || isContext(node)) {
      names.push(getItsName(node))
    }

    return findSuites(node.parent, names)
  }

  const skipAllTests = node => {
    // if (isIt(node)) {
    //   console.log('it %s', getItsName(node))
    // } else if (isDescribe(node)) {
    //   console.log('describe %s', getItsName(node))
    // } else if (isContext(node)) {
    //   console.log('context %s', getItsName(node))
    // }

    if (isIt(node)) {
      const names = [getItsName(node)]
      findSuites(node, names)

      // we were searching from inside out, thus need to revert the names
      const testName = names.reverse()
      console.log('found test', testName)
      if (!shouldLeaveTest(testName)) {
        console.log('should skip this test')
        node.update('it.skip' + node.source().substr(2))
        // console.log(node)
      }
    }
  }
  const output = falafel(source, skipAllTests)
  // console.log(output)
  fs.writeFileSync(specFilename, output, 'utf8')
}

module.exports = {
  skipAllOtherTests
}

if (!module.parent) {
  skipAllOtherTests('./cypress/integration/spec.js', [
    ['outside', 'inside', 'fails when env variable FAIL is set']
  ])
}
