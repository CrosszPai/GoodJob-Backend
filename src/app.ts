import express from "express";
import { add } from "./add";
import swaggerUi from 'swagger-ui-express'

import { swaggerSpec } from './swagger-doc'

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

/**
 * @swagger
 *  / :
 *   get:
 *     description: Test api doc by hello world
 *     responses: 
 *        200:
 *          description: send Hello World text
 */
app.get('/', (req, res) => {
    res.send("Hello World")
})

app.get('/api-doc.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
})

app.get('/', (req, res) => {
    res.send(add('Hello ', 'World'))
})

app.post('/', (req, res) => {
    res.status(200)
        .json(req.body)
})


export default app