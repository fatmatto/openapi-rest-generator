# Openapi generator

Automatically generate OpenApi specification document (yaml or json) for a REST API given its resources


### Usage

```bash
node index.js 
  --resource=User,Users \
  --resource=Group,Groups \
  --resource=Role,Roles \
  --resource=ACLRule,ACLRules \
  --output=./openapi.json \
  --format=json
```