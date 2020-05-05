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
    let selects = await SelectedModel.findOne({
        user: userOid,
        job: jobOid
    })
        .populate('job')
        .populate('user')
    selects['status'] = status
    console.log(status);
    
    return selects.save()
};

export const getSelectedUser = async (jobId: string, status: string) => {
    return SelectedModel.find(
        status ?
            {
                job: mongoose.Types.ObjectId(jobId),
                status
            } :
            {
                job: mongoose.Types.ObjectId(jobId),
            }
    )
        .populate('user');
};

export const getSelectingUser = async (jobId: string) => {
    return SelectedModel.find({
        job: mongoose.Types.ObjectId(jobId),
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
        status ?
            {
                status,
                user: userOid
            } :
            {
                user: userOid
            }
    )
        .populate('job')
    return select
}

export const getUserPositionInfo = async (userId: string, jobId: string) => {
    let jobOid = mongoose.Types.ObjectId(jobId)
    let userOid = mongoose.Types.ObjectId(userId)
    let pos = await SelectedModel.find({
        job: jobOid,
        user: userOid
    })
        .populate('job')
    return pos
}
