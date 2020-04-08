import {Request, Response} from "express";
import {createUser, updateUser} from '../model/user.model'

export class UserController {
    static async createUserByEmail(req: Request, res: Response) {
        let {email} = req.body;
        await createUser(email);
        res.status(201)
            .send('user created')
    }

    static async editUserProfile(req: Request, res: Response) {
        let {email, info} = req.body;
        let w = await updateUser(email, info);
        console.log(w);

        res.status(202)
            .send('updated')
    }
}
