const falafel = require('falafel')
const fs = require('fs')
const source = fs.readFileSync('./cypress/integration/spec.js', 'utf8')

const isDescribe = (node) => {
  return node.type === 'CallExpression' &&
    node.callee && node.callee.type === 'Identifier' &&
    node.callee.name === 'describe'
}

const isContext = (node) => {
  return node.type === 'CallExpression' &&
    node.callee && node.callee.type === 'Identifier' &&
    node.callee.name === 'context'
}

const isIt = (node) => {
  return node.type === 'CallExpression' &&
    node.callee && node.callee.type === 'Identifier' &&
    node.callee.name === 'it'
}

const getItName = (node) =>
  node.arguments[0].value

const skipAllTests = (node) => {
  if (isIt(node)) {
    console.log('it %s', getItName(node))
  } else if (isDescribe(node)) {
    console.log('describe %s', getItName(node))
  } else if (isContext(node)) {
    console.log('context %s', getItName(node))
  }
}
const output = falafel(source, skipAllTests)
// console.log(output)
