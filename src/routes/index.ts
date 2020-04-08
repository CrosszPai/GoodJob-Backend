import express from "express";
import { add } from "../utils/add";
import swaggerUi from 'swagger-ui-express'

import swaggerDoc from './swaggerDoc.json'
import { UserController } from "../controller/user.controller";
import { JobController } from "../controller/job.controller";
import {CommentController} from "../controller/comment.controller";

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api-docs', swaggerUi.serve)

app.get('/api-docs', swaggerUi.setup(swaggerDoc))


app.get('/', async (req, res) => {
    res.send("Hello World")
})


app.get('/', (req, res) => {
    res.send(add('Hello ', 'World'))
})

app.post('/', (req, res) => {
    res.status(200)
        .json(req.body)
})

app.post('/w/:id',CommentController.postComment)
app.post('/w/:id/comment/:comment',CommentController.replyComment)
app.get('/r/:id',CommentController.getComments)

export default app
