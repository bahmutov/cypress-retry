const falafel = require('falafel')
const fs = require('fs')
const source = fs.readFileSync('./cypress/integration/spec.js', 'utf8')

const isTestBlock = (name) => (node) => {
  return node.type === 'CallExpression' &&
    node.callee && node.callee.type === 'Identifier' &&
    node.callee.name === name
}

const isDescribe = isTestBlock('describe')

const isContext = isTestBlock('context')

const isIt = isTestBlock('it')

const getItsName = (node) =>
  node.arguments[0].value

const findSuites = (node, names = []) => {
  if (!node) {
    return
  }

  if (isDescribe(node) || isContext(node)) {
    names.push(getItsName(node))
  }

  return findSuites(node.parent, names)
}

const skipAllTests = (node) => {
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
    console.log('found', names)
  }
}
const output = falafel(source, skipAllTests)
// console.log(output)
