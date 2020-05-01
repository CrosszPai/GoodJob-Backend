import {getUserById} from "../model/user.model";
import {JobModel} from "../model/job.model";

export const checkIfOwner = async (userId: string, jobId: string): Promise<boolean> => {
    let user = await getUserById(userId)
    let job = await JobModel.findById(jobId)
        .populate('owner')
    return user._id === job['owner']._id;
}
