import mongoose from 'mongoose'
import {Job} from "../interface/job.interface";
import {UserModel} from "./user.model";

export const JobSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    title: String,
    description: String,
    start_date: Date,
    finish_date: Date,
    owner:{
        type:mongoose.Types.ObjectId,
        ref:'user'
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
        _id:new mongoose.Types.ObjectId(),
        ...info,
        owner: user._id
    })
    return await job.save()
}

export const updateJob = async(id:string,info:Job):Promise<mongoose.Document>=>{
    let job = await JobModel.findOne({
        _id:id
    })
    for (const key in info) {
        if (info.hasOwnProperty(key)) {
            job[key] = info[key];

        }
    }
    return await job.save()
}
