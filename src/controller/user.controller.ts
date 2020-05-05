import { Request, Response } from "express";
import { createUser, getAllUser, getUserById, updateUser } from '../model/user.model'
import admin from "firebase-admin";
import verify from "../utils/verify";
import { getUserPositionInfo, getUserSelectedByStatus } from "../model/selected.model";
import { PositionModel } from "../model/position.model";
import { Types } from "mongoose";

export class UserController {
    static async login(req: Request, res: Response) {
        let token = req.headers.idtoken;

        try {
            if (typeof (token) !== "string") {
                return res.status(401).send("invalid token type")
            }
            let uid = await verify(token);
            let result = await getUserById(uid)
            if (!result) {
                const userRecord = await admin.auth().getUser(uid);
                let t = await createUser({
                    email: userRecord.email || userRecord.providerData[0].email,
                    photoURL: userRecord.photoURL,
                    uid: userRecord.uid
                });
                return res.json(t)
            } else {
                return res.json(result)
            }
        } catch (err) {
            console.log(err);

            return res.status(401)
                .send(err)
        }
    }

    static async createUserByUID(req: Request, res: Response) {
        let token: any = req.headers.idtoken;
        let uid = await verify(token);
        let userRecord = await admin.auth().getUser(uid);
        try {
            await createUser({
                email: (userRecord.email || userRecord.providerData[0].email),
                photoURL: userRecord.photoURL,
                uid: userRecord.uid
            });
            return res.status(201)
                .send('user created')
        } catch (err) {
            return res.status(406)
                .send(`can't create ${err}`)
        }
    }

    static async editUserProfile(req: Request, res: Response) {
        let token = req.headers.idtoken;
        let info = req.body;
        try {
            if (typeof (token) !== "string") {
                throw new Error("invalid token type")
            }
            let uid = await verify(token);
            let userRecord = await admin.auth().getUser(uid);
            await updateUser(userRecord.uid, info);
            return res.status(202)
                .send('updated')
        } catch (err) {
            console.log(err);
            return res.status(401)
                .send(err)

        }
    }

    static async getAllUserWithInfo(req: Request, res: Response) {
        let w = await getAllUser();
        res.send(w)
    }

    static async getUserProfile(req: Request, res: Response) {
        let token = req.headers.idtoken;
        if (!token) {
            return res.status(401)
                .send('Bad Request')
        }
        if (typeof (token) !== "string") {
            return res.status(401).send("invalid token type")
        }
        try {
            let uid = await verify(token);
            let w = await getUserById(uid);
            return res.json(w)
        } catch (error) {
            console.log(error);
            return res.status(401)
                .send(error)
        }
    }

    static async getUserProfileById(req: Request, res: Response) {
        let token = req.headers.idtoken;
        let userId = req.params.id
        if (!token) {
            return res.status(401)
                .send('Bad Request')
        }
        if (typeof (token) !== "string") {
            return res.status(401).send("invalid token type")
        }
        try {
            await verify(token);
            let w = await getUserById(userId);
            return res.json(w)
        } catch (error) {
            console.log(error);
            return res.status(401)
                .send(error)
        }
    }

    static async getUserJobByStatus(req: Request, res: Response) {
        let token = req.headers.idtoken;
        let status = req.query.status
        if (!token) {
            return res.status(401)
                .send('Bad Request')
        }
        if (typeof (token) !== "string") {
            return res.status(401).send("invalid token type")
        }
        try {
            let uid = await verify(token);
            let user = await getUserById(uid)
            console.log(user, uid, 'user');

            let jobs = await getUserSelectedByStatus(user._id, status)
            let jobs_obj = await Promise.all(jobs.map(async (v) => {
                let obj = v.toObject()
                let obj_2 = obj.job
                obj_2.status = obj.status
                obj_2.position = obj.position
                let pos = await PositionModel.findOne({
                    job: Types.ObjectId(v['job']['_id']),
                    name: obj_2.position
                })
                obj_2.wage = pos['wage']
                return obj_2
            }))

            return res.json(jobs_obj)
        } catch (error) {
            console.log(error);
            return res.status(401)
                .send(error)
        }
    }

    static async getUserJobPosition(req: Request, res: Response) {
        let token = req.headers.idtoken;
        let jobId = req.params.id
        if (typeof (token) !== "string") {
            return res.status(401).send("invalid token type")
        }
        try {
            let uid = await verify(token);
            let user = await getUserById(uid)
            let pos = await getUserPositionInfo(user._id, jobId)
            return res.json(pos)
        } catch (error) {
            console.log(error);
            return res.status(401)
                .send(error)
        }
    }
}
