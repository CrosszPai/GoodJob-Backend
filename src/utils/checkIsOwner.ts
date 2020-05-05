import { getUserById } from "../model/user.model";
import { JobModel } from "../model/job.model";
import { Types } from "mongoose";

export const checkIfOwner = async (userId: string, jobId: string): Promise<boolean> => {
    let user = Types.ObjectId(userId)
    let job = await JobModel.findById(jobId)
        .populate('owner')
    console.log(user, job);
    console.log(user.equals(job['owner']));

    return user.equals(job['owner'])
}
