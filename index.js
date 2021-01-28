const argv = require('yargs').argv
const fs = require('fs')
const yaml = require('gray-matter')
const format = argv.format || 'json'
const { makePaths } = require('./template')

if (format !== 'json' && format !== 'yaml') {
  console.log('Error: only valid formats are json and yaml')
  process.exit(1)
}

const outputFile = argv.output || `openapi.${format}`

let resources = argv.resource || ['Pets,Users']

const baseSpec = require('./base_template.json')
if (!Array.isArray(resources)) {
  resources = [resources]
}
resources.forEach(resource => {
  const [resourceNameSingular, resourceNamePlural] = resource.split(',')
  const spec = makePaths(resourceNameSingular, resourceNamePlural)
  baseSpec.paths = Object.assign({}, baseSpec.paths, spec)
  const resourceNameSingularUppercase = resourceNameSingular.charAt(0).toUpperCase() + resourceNameSingular.slice(1)
  baseSpec.components.schemas[resourceNameSingularUppercase] = {
    type: 'object',
    properties: {}
  }
})

let outputContent = ''
if (format === 'yaml') {
  const yamled = yaml.stringify('', baseSpec)
  outputContent = yamled.replaceAll('---', '')
}

if (format === 'json') {
  outputContent = JSON.stringify(baseSpec, null, 2)
}

fs.writeFile(outputFile, outputContent, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Wrote to', outputFile)
  }
})
