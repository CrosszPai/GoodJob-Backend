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
    status: String,
    position: {
        type: mongoose.Types.ObjectId,
        ref: 'position'
    }
});

export const SelectedModel = mongoose.model('selected', SelectedSchema);

export const addSelected = async (jobId: string, userId: string, status: string, position: string) => {
    let selected = new SelectedModel({
        _id: new mongoose.Types.ObjectId(),
        job: new mongoose.Types.ObjectId(jobId),
        user: new mongoose.Types.ObjectId(userId),
        status,
        position
    });
    return await selected.save()
};

export const updateSelected = async (jobId: string, userId: string, status: string) => {
    return SelectedModel.findOneAndUpdate({
        jobId,
        userId
    }, {
        status
    });
};

export const getSelectedUser = async (jobId: string) => {
    return SelectedModel.find({
        job: jobId
    })
        .populate('user');
};

export const removeSelected = async (id: string) => {
    return SelectedModel.deleteOne({
        $or: [{
            _id: id
        }, {
            user: id
        }]
    });
};

export const geUserFinished = async (id: string) => {
    return SelectedModel.find(
        {
            status: 'finished'
        }
    )
}

export const getUserPositionInfo = async (userId: string, jobId: string) => {
    return SelectedModel.find({})
        .populate({
            path: 'job',
            match: {
                _id: jobId
            }
        })
        .populate({
            path: 'user',
            match: {
                _id: userId
            }
        })
        .populate('position')
}
