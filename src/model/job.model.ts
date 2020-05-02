import mongoose from 'mongoose'
import { Job } from "../interface/job.interface";
import { getAvailableUserForJob, UserModel } from "./user.model";
import { addSelected } from './selected.model';
import { createNewPosition, PositionModel } from './position.model';
import checkArrayEmpty from "../utils/isArrayEmpty";
import shuffle from '../utils/shuffleArray'

export const JobSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    title: String,
    description: String,
    start_date: Date,
    finish_date: Date,
    location: Object,
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
    }],
    created: {
        type: Date,
        default: Date.now()
    },
    updated: {
        type: Date,
        default: Date.now()
    }
});
export const JobModel = mongoose.model('job', JobSchema);

export const createJob = async (email: string, { description, finish_date, location, mode, positions, start_date, title }: Job): Promise<mongoose.Document> => {
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
        owner: user._id,
    });
    console.log(job);
    let saving = await job.save()
    console.log(saving);
    saving['positions'] = await Promise.all(positions.map(async (position) => {
        return await createNewPosition(job._id, { ...position })
    }))
    const l = await saving.save();
    if (mode === 'auto') {
        let users = await getAvailableUserForJob(job._id, {});
        users = shuffle(users)
        const store: mongoose.Document[] = []
        for (const { name, required, } of positions) {
            users = [...users, ...store]
            if (checkArrayEmpty(users))
                break
            for (let index = 0; index < required;) {
                if (checkArrayEmpty(users))
                    break
                let current_user = shuffle(users).pop();
                if (!current_user['interested'].includes(name)) {
                    store.push(current_user)
                    continue
                }
                let w = await addSelected(job._id, current_user._id, 'inviting', name);
                w['wating'] = Date.now()
                await w.save()
                current_user['selectedBy'] = [...current_user['selectedBy'], w._id];
                await current_user.save()
                index++
            }
        }
    } else if (mode === 'manual') {
        let users = await getAvailableUserForJob(job._id, {});
        for (const doc of shuffle(users)) {
            await addSelected(job._id, doc._id, 'selecting', undefined)
        }
    }
    return l
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
    job['updated'] = Date.now()
    return await job.save()
};

export const getAvailableJobForUser = async () => {
    let userJob = await PositionModel.find({})
        .populate('job')
        .populate('apply')
    return userJob.filter(v => v['required'] > v['apply'].lenght)
}
