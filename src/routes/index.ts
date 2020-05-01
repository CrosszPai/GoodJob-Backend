import express from "express";
import { add } from "../utils/add";
import swaggerUi from 'swagger-ui-express'

import swaggerDoc from './swaggerDoc.json'

import cors from 'cors';
import JobRoute from "./job";
import AuthRoute from './auth'
import UserRoute from './user'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use('/api-docs', swaggerUi.serve)
app.get('/api-docs', swaggerUi.setup(swaggerDoc))


app.get('/', (req, res) => {
    return  res.send("Hello World")
})

app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/job", JobRoute)

export default app
