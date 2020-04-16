import app from './routes/index'
import {initMongoose} from './utils/db'

const PORT = process.env.PORT || 8000

initMongoose()
    .then(async () => {
        app.listen(PORT, () => {
            console.log(`Listing on port ${PORT}`);
        })
    })
    .catch(err=>{
        console.log(err);
        process.exit(1)
    })



