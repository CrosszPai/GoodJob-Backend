import mongoose from 'mongoose'

export const initMongoose = async () => {
    try {
        await mongoose.connect(process.env.atlas_db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    } catch (err) {
        console.error(err)
    }
}
