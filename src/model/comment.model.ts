import mongoose from 'mongoose'
import { JobModel } from "./job.model";
import { Comment } from "../interface/comment.interface";

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
    reply: String,
    created: {
        type: Date,
        default: Date.now()
    },
    updated: {
        type: Date,
        default: Date.now()
    }
});
export const CommentModel = mongoose.model('comment', CommentSchema)


export const createComment = async (
    posterId: string,
    jobId: string,
    content: string
) => {
    const job = await JobModel.findOne({
        _id: jobId,
    });
    const comment = new CommentModel({
        _id: new mongoose.Types.ObjectId(),
        posterId: mongoose.Types.ObjectId(posterId),
        content: content,
        job: job._id
    });
    job['comments'].push(comment)
    await job.save()
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
    comment['updated'] = Date.now()
    return await comment.save()
};


export const getAllComment = async (jobId: string) => {
    return CommentModel.find({
        job: jobId
    });
}
