import app from './routes/index'
import {initMongoose} from './utils/db'
import mongoose from 'mongoose'

require('dotenv').config()

const PORT = process.env.PORT || 8000

initMongoose()
    .then(async () => {
        app.listen(PORT, () => {
            console.log(`Listing on port ${PORT}`);
        })
    })



