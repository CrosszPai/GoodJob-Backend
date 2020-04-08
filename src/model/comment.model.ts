import mongoose from 'mongoose'
import {JobModel} from "./job.model";
import {Comment} from "../interface/comment.interface";

export const CommentSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    job: {
        type: mongoose.Types.ObjectId,
        ref: 'job'
    },
    posterId: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    content: String,
    reply: String
});
export const CommentModel = mongoose.model('comment', CommentSchema)


export const createComment = async (
    jobId: string,
    email: string,
    content: string
) => {
    const job = await JobModel.findOne({
        _id: jobId,
    });
    const comment = new CommentModel({
        _id: new mongoose.Types.ObjectId(),
        content: content,
        job: job._id
    });
    return await comment.save()
};

export const updateComment = async (
    commentId: string,
    info: Comment
) => {
    const comment = await CommentModel.findOne({
        _id: commentId,
    });
    for (const key in info) {
        if (info.hasOwnProperty(key)) {
            comment[key] = info[key]
        }
    }
    return await comment.save()
};


export const getAllComment = async (jobId:string)=>{
    return CommentModel.find({
        job: jobId
    });
}
