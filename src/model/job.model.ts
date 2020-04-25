import mongoose from 'mongoose'
import {Job} from "../interface/job.interface";
import {getAvailableUser, UserModel} from "./user.model";
import {addSelected, SelectedModel} from './selected.model';
import {createNewPosition} from './position.model';

export const JobSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    title: String,
    description: String,
    start_date: Number,
    finish_date: Number,
    positions: [{
        type: mongoose.Types.ObjectId,
        ref: 'position'
    }],
    tags: [String],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: 'comment'
    }]
});
export const JobModel = mongoose.model('job', JobSchema);

export const createJob = async (email: string, {description, finish_date, location, mode, positions, start_date, title}: Job): Promise<mongoose.Document> => {
    let user = await UserModel.findOne({
        email
    });
    let job = new JobModel({
        _id: new mongoose.Types.ObjectId(),
        title,
        finish_date,
        start_date,
        description,
        location,
        owner: user._id
    });
    const createdPositionList = positions.map(async (position) => {
        return await createNewPosition(job._id, {...position})
    });
    job['positions'].push(createdPositionList);
    const l = await job.save();
    if (mode === 'auto') {
        const users = await getAvailableUser(job._id, {});
        for (const {name, required, wage} of positions) {
            for (let index = 0; index < required; index++) {
                let current_user = shuffle(users).pop();
                
                let w = await addSelected(job._id, current_user._id, 'inviting', name);
                current_user['selectedBy'] = [...current_user['selectedBy'], w._id];
                await current_user.save()
            }
        }
    } else if (mode === 'manual') {
        let users = await getAvailableUser(job._id, {});
        for (const doc of shuffle(users)) {
            let w = await addSelected(job._id, doc._id, 'selecting', undefined)
        }
    }
    return l
};

export const ajob = async (jobId: string) => {
    let job = await JobModel.findById(jobId);
    return await getAvailableUser(job._id, {})
};

export const updateJob = async (id: string, info: Job): Promise<mongoose.Document> => {
    let job = await JobModel.findOne({
        _id: id
    });
    for (const key in info) {
        if (info.hasOwnProperty(key)) {
            job[key] = info[key];

        }
    }
    return await job.save()
};

export const sendInvite = async (userIds: string[]) => {
    let u = await SelectedModel.updateMany({
        _id: {
            $in: userIds
        }
    }, {status: 'inviting'})
};

export const testComment = async () => {
    let a = await JobModel.find()
        .populate({
            path: 'comments',
        });
    return a
};
