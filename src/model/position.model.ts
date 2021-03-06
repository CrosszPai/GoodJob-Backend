import mongoose, { Document } from 'mongoose'
import { JobModel } from './job.model'
import { Position } from '../interface/position.interface'

export const PositionSchema = new mongoose.Schema({
    job: {
        type: mongoose.Types.ObjectId,
        ref: 'job'
    },
    required: Number,
    wage: Number,
    name: String,
    apply: [{
        type: mongoose.Types.ObjectId,
        ref: 'selected'
    }]
});

export const PositionModel = mongoose.model('position', PositionSchema);

export const createNewPosition = async (jobId: string, { name, required, wage }: Position) => {
    let job = await JobModel.findById(jobId);
    let pos = new PositionModel({
        job: mongoose.Types.ObjectId(jobId),
        name,
        required,
        wage
    });
    let sp = await pos.save();
    job['positions'].push(sp);
    await job.save();
    return sp
};

export const addUserApply = async (selected: Document) => {
    let apply = await PositionModel.findOne({
        job: mongoose.Types.ObjectId(selected['job']['_id']),
        name: selected['position']
    })
    apply['apply'].push(mongoose.Types.ObjectId(selected['_id']))
    return apply.save()
}