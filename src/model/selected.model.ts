import mongoose, { Types } from 'mongoose'

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
    position: String,
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
        job: mongoose.Types.ObjectId(jobId),
        user: mongoose.Types.ObjectId(userId),
        status,
        position
    });
    return await selected.save()
};

export const updateSelected = async (jobId: string, userId: string, status: string) => {
    let jobOid = mongoose.Types.ObjectId(jobId)
    let userOid = mongoose.Types.ObjectId(userId)
    let selects = await SelectedModel.find({})
        .populate('user')
        .populate({
            path: 'job'
        })
    console.log(selects);

    let target = selects.filter(v => userOid.equals(v['user']._id) && jobOid.equals(v['job']._id)).pop()
    target['status'] = status
    return target.save()
};

export const getSelectedUser = async (jobId: string) => {
    return SelectedModel.find({
        job: jobId
    })
        .populate('user');
};

export const getSelectingUser = async (jobId: string) => {
    return SelectedModel.find({
        job: jobId,
        status: 'selecting'
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
    let userOid = mongoose.Types.ObjectId(userId)
    let select = await SelectedModel.find(
        {
            status
        }
    )
        .populate('user')
        .populate('job')
    console.log(userOid, userId, 'id');

    console.log(select, 'before filter\n');
    console.log(select.filter(v => userOid.equals(v['user']._id)))

    return select.filter(v => userOid.equals(v['user']._id))
}

export const getUserPositionInfo = async (userId: string, jobId: string) => {
    let jobOid = mongoose.Types.ObjectId(jobId)
    let userOid = mongoose.Types.ObjectId(userId)
    let pos = await SelectedModel.find({})
        .populate('job')
    return pos.filter(v => jobOid.equals(v['job']._id) && userOid.equals(v['user']._id))
        .pop()
}
