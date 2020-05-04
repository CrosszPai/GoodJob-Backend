import mongoose from 'mongoose'
import { User } from "../interface/user.interface";
import { JobModel } from './job.model';

export const UserSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    firstname: String,
    lastname: String,
    gender: String,
    current_role: String,
    current_province: String,
    interested: [String],
    introduce_text: String,
    age: Number,
    phone_number: String,
    id_card: String,
    email: String,
    photoURL: String,
    uid: String,
    selectedBy: [{
        type: mongoose.Types.ObjectId,
        ref: 'selected'
    }]
});

export const UserModel = mongoose.model('user', UserSchema);

export const createUser = async (info: { uid: string, email: string, photoURL: string }): Promise<mongoose.Document> => {
    let user = new UserModel({
        _id: new mongoose.Types.ObjectId(),
        email: info.email,
        photoURL: info.photoURL,
        uid: info.uid
    });
    return await user.save()
};

export const updateUser = async (uid: string, info: User): Promise<mongoose.Document> => {
    let user = await UserModel.findOne({
        uid
    });
    for (const key in info) {
        if (info.hasOwnProperty(key)) {
            user[key] = info[key];
        }
    }
    return await user.save()

};

export const getAllUser = async () => {
    return UserModel.find()
        .populate({
            path: 'selectedBy',
            populate: {
                path: 'job',
            }
        });
};

export const getUserById = async (id: string): Promise<mongoose.Document> => {
    return UserModel.findOne(
        id.length === 24 ?
            {
                _id: mongoose.Types.ObjectId(id)
            } :
            {
                uid: id
            }
    ).populate({
        path: 'selectedBy',
        populate: {
            path: "job"
        }
    })
};

export const getAvailableUserForJob = async (jobID: string, condition: object) => {
    let job = await JobModel.findOne({
        _id: mongoose.Types.ObjectId(jobID)
    });
    let search = job['tags'].map((v: string) => ({ interested: v }))
    if (search.length <= 0) {
        return []
    }
    let users = await UserModel.find(
        {
            $or: [
                ...search,
            ],
        }
    ).populate({
        path: 'selectedBy',
        populate: {
            path: 'job'
        }
    });
    console.log(users, '\n');

    // console.log(users);
    return users.filter((v) => {
        // check not busy
        console.log(v['selectedBy'].length);

        for (let index = 0; index < v['selectedBy'].length; index++) {
            if (v['selectedBy'][index]['job'].start_date <= job['finish_date'] && v['selectedBy'][index]['job'].finish_date >= job['start_date']) {
                return false
            }
        }
        return true
    })
};
