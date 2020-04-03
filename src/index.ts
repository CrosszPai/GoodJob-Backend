import app from './routes/index'
import initORM from './utils/db'
require('dotenv').config()

const PORT = process.env.PORT || 8000

initORM()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Listing on port ${PORT}`);
        })
    })
    .catch(err => console.log(err)
    )

