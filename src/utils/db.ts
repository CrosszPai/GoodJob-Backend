import mongoose from 'mongoose'

export const initMongoose = async () => {
    try {
        await mongoose.connect('mongodb+srv://admin:crosszpai13@cluster0-gpf70.mongodb.net/GoodJob?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    } catch (err) {
        console.error(err)
    }
}