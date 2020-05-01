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
    },
    created: {
        type: Date,
        default: Date.now()
    },
    waiting: Date
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

export const removeExpireInvite = async () => {
    let d = new Date()
    d.setDate(d.getDate() - 2)
    SelectedModel.updateMany({
        status: 'inviting',
        waiting: {
            $lt: d.getTime(),
        }
    }, {
        status: 'cancel'
    })
}

export const getUserSelectedByStatus = async (userId: string, status: string) => {
    let select = await SelectedModel.find(
        {
            status
        }
    )
        .populate('user')
        .populate('job')
    return select.filter(v => v['user']._id === userId)
}

export const getUserPositionInfo = async (userId: string, jobId: string) => {
    let pos = await SelectedModel.find({})
        .populate('job')
        .populate('user')
        .populate('position')
    return pos.filter(v => v['job']._id === jobId && v['user']._id === userId)
        .pop()
}
