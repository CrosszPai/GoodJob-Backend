import mongoose from 'mongoose'

export const SelectedSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    job: {
        type: mongoose.Types.ObjectId,
        ref: 'job'
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    status: String
});

export const SelectedModel = mongoose.model('selected', SelectedSchema);

export const addSelected = async (jobId: string, userId: string, status: string) => {
    let selected = new SelectedModel({
        _id: new mongoose.Types.ObjectId(),
        job: new mongoose.Types.ObjectId(jobId),
        user: new mongoose.Types.ObjectId(userId),
        status
    })
    return await selected.save()
}

export const updateSelected = async (jobId: string, userId: string, status: string) => {
    let target = await SelectedModel.findOneAndUpdate({
        jobId,
        userId
    }, {
        status
    })
    return target
}