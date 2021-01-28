const fs = require('fs')

const argv = require('yargs').argv
const yaml = require('js-yaml')
// const str = fs.readFileSync(argv.file, 'utf8')
const file = fs.readFileSync(argv.input, 'utf8')

const spec = yaml.safeLoad(file)

console.log(JSON.stringify(spec, null, 2))

function getEndpoints (spec) {
  const endpoints = []

  for (const path in spec.paths) {
    for (const method in spec.paths[path]) {
      const endpoint = {
        method: method,
        path: path,
        summary: spec.paths[path][method].summary,
        operationId: spec.paths[path][method].operationId,
        description: spec.paths[path][method].description,
        parameters: spec.paths[path][method].parameters,
        responses: spec.paths[path][method].responses,
        requestBody: spec.paths[path][method].requestBody,
        resource: spec.paths[path][method].tags[0]
      }

      endpoints.push(endpoint)
    }
  }
  return endpoints
}

function renderEndpoint (endpoint) {
  let requestBody = ''
  let parameters = ''
  const response = ''

  if (endpoint.requestBody) {
    requestBody = `
**Body Parameters**

Coming soon
`
  }
  if (endpoint.parameters) {
    parameters = `
**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
${endpoint.parameters.map(param => {
    console.log(param)
    if (param.$ref) {
      console.log('Devo risolvere')
      param = resolveRef(param.$ref, spec)
      console.log('Ora param è', param)
    }
    return `| ${param.name} | ${param.schema.type} | ${param.description} |`
  }).join('\n')}

`
  }

  if (endpoint.responses && endpoint.responses['200']) {
    const responseJson = getJSONResponse(endpoint.responses['200'])
    parameters = `
**Response (200)**
\`\`\`json
${JSON.stringify(responseJson)}
\`\`\`
`
  }
  return `
#### ${endpoint.operationId}

${endpoint.description}

\`\`\`http
${endpoint.method.toUpperCase()} ${spec.servers[0].url}${endpoint.path}
\`\`\`

${requestBody}

${parameters}
`
}

function renderResource (resourceName, endpoints) {
  const e = endpoints.filter(e => e.resource === resourceName)
  return `
<hr>

### ${resourceName}

${e.map(renderEndpoint).join('\n')}

`
}

function getJSONResponse (res) {
  if (res && res.content && res.content['application/json'] && res.content['application/json'].schema) {
    const schema = res.content['application/json'].schema

    if (schema.$ref) {
      const name = schema.$ref.split('/').pop()
      const component = spec.components.schemas[name]
      console.log('Er component', component)
      // const props = Object.keys(component.properties).map(key => {
      //   const o = component.properties[key]
      //   o.name = key
      //   return o
      // })
      // return props
      return { hello: 'world' }
    }
  }
}

function renderComponentAsTable (spec, refPath) {
  const name = refPath.split('/').pop()
  const component = spec.components.schemas[name]

  const props = Object.keys(component.properties).map(key => {
    const o = component.properties[key]
    o.name = key
    return o
  })

  return `
| Name | Type | Description |
| ---- | ---- | ----------- |
${props.map(prop => {
    return `| ${prop.name} | ${prop.type} | ${prop.description} |`
  })}
`
}

function renderComponentAsJSON (spec, refPath) {
  const name = refPath.split('/').pop()
  const component = spec.components.schemas[name]

  var o = {

  }

  return component
}

function renderSpec (spec) {
  const endpoints = getEndpoints(spec)
  const resources = [...new Set(endpoints.map(e => e.resource))]

  const resourcesBlock = resources.map((r) => {
    return renderResource(r, endpoints)
  }).join('\n')

  const content = `
# ${spec.info.title}

${spec.info.description}

${resourcesBlock}
`

  return content
}

fs.writeFileSync(argv.output, renderSpec(spec), (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log(`Markdown documentation successfully written to ${argv.output}`)
  }
})

function resolveRef (ref, spec) {
  const paths = ref.split('/').slice(1)
  console.log('paths', paths)
  let pointer = spec
  paths.forEach(pathname => {
    pointer = pointer[pathname]
  })
  return pointer
}
