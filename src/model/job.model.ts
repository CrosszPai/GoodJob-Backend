import mongoose, { model } from 'mongoose'
import { Job } from "../interface/job.interface";
import { getAvailableUserForJob, UserModel, getUserById } from "./user.model";
import { addSelected, SelectedModel } from './selected.model';
import { createNewPosition, PositionModel } from './position.model';
import checkArrayEmpty from "../utils/isArrayEmpty";
import shuffle from '../utils/shuffleArray'
import _ from 'lodash'
import groupBy from '../utils/groupBy';

export const JobSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    title: String,
    description: String,
    start_date: Date,
    finish_date: Date,
    location: Object,
    mode: String,
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
    let tags = positions.map(v => v.name)
    let job = new JobModel({
        _id: new mongoose.Types.ObjectId(),
        title,
        finish_date,
        start_date,
        description,
        location,
        owner: user._id,
        positions: [],
        mode,
        tags
    });

    await job.save();
    let newjob = await JobModel.findOne({
        _id: job._id
    })
    await Promise.all(positions.map(async (position) => {
        return await createNewPosition(job._id, { ...position })
    }))
    let l = await newjob.save()
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
export const getAvailableJobForUser = async (uid: string) => {
    let user = await getUserById(uid)
    let u_selected = await SelectedModel.find({
        user: mongoose.Types.ObjectId(user._id)
    })
    let alreadyJob = u_selected
        .filter(v => {
            return v['status'] === 'inviting'
                || v['status'] === 'cancle'
                || v['status'] === 'accept'
                || v['status'] === 'finihed'
                || v['status'] === 'applying'
        }
        ).map(v => v['job'].toString())
    console.log(alreadyJob);

    let userJob = await PositionModel.find({})
        .populate({
            path: 'job',
            populate: {
                path: 'owner'
            }
        })
        .populate('apply')
    let w = userJob.filter(v => {
        return (v['required'] > v['apply'].length) && v['job']['mode'] === 'manual'
    })
    console.log(w.length);
    console.log(w.map(i=>i._id));
    
    let w2 = w.filter(v => {
        let jobOid = mongoose.Types.ObjectId(v['job']['_id'])

        if (alreadyJob.includes(jobOid.toHexString())) {
            console.log(jobOid.toHexString());
            return false
        }
        return true
    })
    console.log(w2.length);



    let toBeReturn = []
    let grouped = _.groupBy(w, (n) => {
        return n['job']['_id']
    })
    for (const key in grouped) {
        if (grouped.hasOwnProperty(key)) {
            let mod = grouped[key][0]['job'].toObject()
            mod.position = grouped[key].map(m => (
                m['name']
            ))
            mod.posWage = grouped[key].map(m => (
                m['wage']
            ))
            mod.posReq = grouped[key].map(m => (
                m['required']
            ))
            mod.posHave = grouped[key].map(m => (
                m['apply'].length
            ))
            delete mod.positions
            toBeReturn.push(mod)
        }
    }
    return toBeReturn
}
