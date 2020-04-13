import mongoose from 'mongoose'
import { Job } from "../interface/job.interface";
import { UserModel, getAvailableUser } from "./user.model";
import { addSelected, SelectedModel } from './selected.model';

export const JobSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    title: String,
    description: String,
    start_date: Number,
    finish_date: Number,
    position: [String],
    posReq: [Number],
    posWage: [Number],
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

export const createJob = async (email: string, info: Job): Promise<mongoose.Document> => {
    let user = await UserModel.findOne({
        email
    })
    let job = new JobModel({
        _id: new mongoose.Types.ObjectId(),
        ...info,
        owner: user._id
    })
    let l = await job.save()
    if (info.mode === 'auto') {
        let users = await getAvailableUser(job._id, {

        })
        users.forEach(async (doc) => {
            let w = await addSelected(job._id, doc._id, 'inviting')
            doc['selectedBy'] = [...doc['selectedBy'], w._id]
            console.log(await doc.save());

        })
    } else if (info.mode === 'manual') {
        let users = await getAvailableUser(job._id, {

        })
        users.forEach(async (doc) => {
            let w = await addSelected(job._id, doc._id, 'selecting')
        })
    }
    return l
}

export const ajob = async (jobId: string) => {
    let job = await JobModel.findById(jobId)
    return await getAvailableUser(job._id, {})
}

export const updateJob = async (id: string, info: Job): Promise<mongoose.Document> => {
    let job = await JobModel.findOne({
        _id: id
    })
    for (const key in info) {
        if (info.hasOwnProperty(key)) {
            job[key] = info[key];

        }
    }
    return await job.save()
}

export const sendInvite = async (userIds: string[]) => {
    let u = await SelectedModel.updateMany({
        _id: {
            $in: userIds
        }
    }, { status: 'inviting' })
}

export const testComment = async () => {
    let a = await JobModel.find()
        .populate({
            path: 'comments',
        })
    return a
}