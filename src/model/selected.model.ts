import mongoose from 'mongoose'

export const SelectedSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    jobId: {
        type: mongoose.Types.ObjectId,
        ref: 'job'
    },
    userID: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    status: String
});

export const SelectedModel = mongoose.model('selected', SelectedSchema);
