import express from "express";
import { add } from "./add";

// setup Express server
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.send(add('Hello ', 'World'))
})

app.post('/', (req, res) => {
    res.status(200)
        .json(req.body)
})


export default app