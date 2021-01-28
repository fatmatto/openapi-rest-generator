const fs = require('fs')
const SwaggerParser = require('swagger-parser')
const argv = require('yargs').argv

// const file = fs.readFileSync(argv.input, 'utf8')
const file = fs.readFileSync('/Users/fat/Projects/apio2/Api/openapi.json', 'utf8')
let spec = null
async function main () {
  // const spec = await SwaggerParser.resolve('/Users/fat/Projects/apio2/Api/openapi.json')
  spec = JSON.parse(file)
  console.log(JSON.stringify(spec, null, 2))
  const endpoints = getEndpoints(spec)
  console.log(JSON.stringify(endpoints, null, 2))
  const output = endpoints.map(renderEndpoint).join('\n')
  fs.writeFileSync('test.md', output)
}

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
  let s = `
<h3>${endpoint.summary}</h3>
<p>${endpoint.description}</p>
<pre style={{ padding: '15px 10px', backgroundColor: '#f0f0f0', fontFamily:'courier', borderRadius:'4px' }}>
  <span style={{ backgroundColor: 'blue', color:'white', padding:'10px', borderRadius:'4px' }}>${endpoint.method.toUpperCase()}</span>
  <span style={{ paddingLeft:'10px' }}>${endpoint.path.replace(/\{/g, '\{`\{').replace(/\}/g, '\}`\}')}</span>
</pre>
  `
  s += `
    <div style={{ fontWeight:'bold' }}>Parameters</div>

| Name | Type | In | Description |
| --- | ----------- | ----------- | ----------- |
`
  if (endpoint.parameters) {
    s += `${endpoint.parameters.map(renderParameter).join('\n')}`
  }

  s += renderBody(endpoint.requestBody)
  s += '\n<hr />'

  return s
}

function renderParameter (param) {
  if (param.$ref) {
    param = resolveRef(param.$ref, spec)
  }
  return `| ${param.name} | ${param.schema.type} | ${param.in} | ${param.description} |`
}

function renderBody (requestBody) {
  if (!(requestBody && requestBody.content && requestBody.content['application/json'] && requestBody.content['application/json'].schema)) {
    return ''
  }
  let schema = requestBody.content['application/json'].schema
  if (schema.$ref) {
    schema = resolveRef(schema.$ref, spec)
  }

  // if (schema.allOf) {
  //   schema = mergeSchemas(schema.allOf)
  // }

  console.log('Dopo aver mergiato, schema e1', schema)

  let toReturn = ''

  for (var key in schema.properties) {
    let prop = schema.properties[key]
    if (prop.$ref) {
      prop = resolveRef(prop.$ref, spec)
    }
    toReturn += `| ${key} | ${prop.type} | body | ${prop.description} |\n`
  }

  return toReturn
}

function resolveRef (ref, spec) {
  console.log(ref)
  const paths = ref.split('/').slice(1)
  console.log('paths', paths)
  let pointer = spec
  paths.forEach(pathname => {
    pointer = pointer[pathname]
  })
  if (pointer.allOf) {
    pointer = mergeSchemas(pointer.allOf)
  }
  return pointer
}

function mergeSchemas (schemas) {
  schemas = schemas.map(schema => {
    if (schema.$ref) {
      return resolveRef(schema.$ref, spec)
    } else {
      return schema
    }
  })

  const output = {
    type: 'object',
    properties: {}
  }

  schemas.forEach(schema => {
    for (const key in schema.properties) {
      output.properties[key] = schema.properties[key]
    }
  })

  return output
}

try {
  main()
} catch (err) {
  console.log(err)
}
