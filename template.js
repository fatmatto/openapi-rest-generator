function makePaths (resourceNameSingular, resourceNamePlural) {
  const resourceNameSingularUppercase = resourceNameSingular.charAt(0).toUpperCase() + resourceNameSingular.slice(1)
  const resourceNameSingularLowercase = resourceNameSingular.toLowerCase()
  const resourceNamePluralUppercase = resourceNamePlural.charAt(0).toUpperCase() + resourceNamePlural.slice(1)
  const resourceNamePluralLowercase = resourceNamePlural.toLowerCase()

  const content = `{
  "/${resourceNamePluralLowercase}": {
    "post": {
      "tags": [
        "${resourceNameSingularUppercase}"
      ],
      "summary": "Create ${resourceNameSingularLowercase}",
      "operationId": "create${resourceNameSingularUppercase}",
      "description": "Create a new ${resourceNameSingularLowercase}",
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/${resourceNameSingularUppercase}"
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "${resourceNameSingularUppercase} successfully created"
        },
        "400": {
          "$ref": "#/components/responses/BadRequestResponse"
        }
      }
    },
    "get": {
      "tags": [
        "${resourceNameSingularUppercase}"
      ],
      "summary": "Search ${resourceNamePluralLowercase}",
      "operationId": "search${resourceNamePluralUppercase}",
      "description": "List matching ${resourceNameSingularUppercase}",
      "parameters": [
        {
          "$ref": "#/components/parameters/filterParameter"
        },
        {
          "$ref": "#/components/parameters/skipParameter"
        },
        {
          "$ref": "#/components/parameters/limitParameter"
        }
      ],
      "responses": {
        "200": {
          "description": "search results matching criteria",
          "content": {
            "application/json": {
              "schema": {
                "properties": {
                  "data": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/${resourceNameSingularUppercase}"
                    }
                  }
                }
              }
            }
          }
        },
        "400": {
          "$ref": "#/components/responses/BadRequestResponse"
        }
      }
    }
  },
  "/${resourceNamePluralLowercase}/count": {

    "get": {
      "tags": [
        "${resourceNameSingularUppercase}"
      ],
      "summary": "Count ${resourceNamePluralLowercase}",
      "description":"Count ${resourceNamePluralLowercase}",
      "operationId": "count${resourceNamePluralUppercase}",
      "responses": {
        "200": {
          "description": "${resourceNamePluralUppercase} number",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "count": {
                    "type": "number",
                    "example": "42"
                  }
                }
              }
            }
          }
        },
        "404": {
          "$ref": "#/components/responses/NotFoundResponse"
        }
      }
    }
  },
  "/${resourceNamePluralLowercase}/{uuid}": {
    "delete": {
      "tags": [
        "${resourceNameSingularUppercase}"
      ],
      "summary": "Delete ${resourceNameSingularLowercase} by uuid",
      "description": "Delete ${resourceNameSingularLowercase} by uuid",
      "operationId": "delete${resourceNamePluralUppercase}ById",
      "parameters": [
        {
          "$ref": "#/components/parameters/uuid"
        }
      ],
      "responses": {
        "200": {
          "description": "The ${resourceNameSingularLowercase} was removed or didnt exist"
        }
      }
    },
    "put": {
      "tags": [
        "${resourceNameSingularUppercase}"
      ],
      "summary": "Update ${resourceNameSingularLowercase} by uuid",
      "description": "Update ${resourceNameSingularLowercase} by uuid",
      "operationId": "update${resourceNamePluralUppercase}ById",
      "parameters": [
        {
          "$ref": "#/components/parameters/uuid"
        }
      ],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/${resourceNameSingularUppercase}"
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "${resourceNameSingularUppercase} data",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/${resourceNameSingularUppercase}"
              }
            }
          }
        },
        "400": {
          "$ref": "#/components/responses/BadRequestResponse"
        },
        "404": {
          "$ref": "#/components/responses/NotFoundResponse"
        }
      }
    },
    "get": {
      "tags": [
        "${resourceNameSingularUppercase}"
      ],
      "summary": "Get ${resourceNameSingularLowercase} by uuid",
      "description": "Get ${resourceNameSingularLowercase} by uuid",
      "operationId": "get${resourceNamePluralUppercase}ById",
      "parameters": [
        {
          "$ref": "#/components/parameters/uuid"
        }
      ],
      "responses": {
        "200": {
          "description": "${resourceNameSingularUppercase} data",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/${resourceNameSingularUppercase}"
              }
            }
          }
        },
        "404": {
          "$ref": "#/components/responses/NotFoundResponse"
        }
      }
    }
  }
}`

  return JSON.parse(content)
}

module.exports = { makePaths }
