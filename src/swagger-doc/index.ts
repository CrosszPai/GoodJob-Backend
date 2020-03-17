import swaggerJSDoc from 'swagger-jsdoc'
const options:swaggerJSDoc.Options = {
    definition: {
      openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
      info: {
        title: 'GoodJob API', // Title (required)
        version: '0.0.1', // Version (required)
      },
    },
    apis:['./src/**/index.ts','index.js']
  };

export const swaggerSpec = swaggerJSDoc(options)