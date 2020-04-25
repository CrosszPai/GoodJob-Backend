import mongoose from 'mongoose'
import {JobModel} from './job.model'
import {Position} from '../interface/position.interface'

export const PositionSchema = new mongoose.Schema({
    job: {
        type: mongoose.Types.ObjectId,
        ref: 'job'
    },
    required: Number,
    wage: Number,
    Name: String,
    apply: [{
        type: mongoose.Types.ObjectId,
        ref: 'selected'
    }]
});

export const PositionModel = mongoose.model('position', PositionSchema);

export const createNewPosition = async (jobId: string, {name, required, wage}: Position) => {
    let job = await JobModel.findById(jobId);
    let pos = new PositionModel({
        job: jobId,
        name,
        required,
        wage
    });
    let sp = await pos.save();
    job['positions'].push(sp);
    await job.save();
    return sp
};