import app from './routes/index'
import {initMongoose} from './utils/db'
import {removeExpireInvite, SelectedModel} from './model/selected.model'

const PORT = process.env.PORT || 8000
let interval = null
initMongoose()
    .then(async () => {
        app.listen(PORT, () => {
            console.log(`Listing on port ${PORT} mode:${process.env.NODE_ENV}`);
        })
        interval = setInterval(async()=>{
            await removeExpireInvite()
        },60*60*1000)
    })
    .catch(err=>{
        console.log(err);
        process.exit(1)
    })



