import mongoose from 'mongoose'
import {User} from "../interface/user.interfaec";

export const UserSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    firstname: String,
    lastname: String,
    gender: String,
    current_role: String,
    current_province: String,
    interested: [String],
    introduce_text: String,
    age:Number,
    phone_number: String,
    id_card: String,
    email: String,
    photoUrl:String,
    selectedBy: [{
        type: mongoose.Types.ObjectId,
        ref: 'selected'
    }]
});

export const UserModel = mongoose.model('user', UserSchema);


export const createUser = async (email: string): Promise<mongoose.Document> => {
    let user = new UserModel({
        _id: new mongoose.Types.ObjectId(),
        email: email
    });
    return await user.save()
};

export const updateUser = async (email: string, info: User): Promise<mongoose.Document> => {
    let user = await UserModel.findOne({
        email,
    });
    for (const key in info) {
        if (info.hasOwnProperty(key)) {
            user[key] = info[key];
        }
    }
    return await user.save()

};
