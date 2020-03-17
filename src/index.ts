import express from "express";

const PORT = process.env.PORT || 8000

// setup Express server
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.listen(PORT, () => {
    console.log(`Listing on port ${PORT}`);
})