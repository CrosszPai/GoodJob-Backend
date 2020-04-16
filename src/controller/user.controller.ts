import { Request, Response } from "express";
import { createUser, updateUser, getUserById, getAllUser } from '../model/user.model'
import admin from "firebase-admin";
import verify from "../utils/verify";

export class UserController {
    static async login(req: Request, res: Response) {
        let token = req.headers.idtoken

        try {
            if (typeof (token) !== "string") {
                throw new Error("invalid token type")
            }
            let uid = await verify(token)
            let result = await getUserById(uid)
            const userRecord = await admin.auth().getUser(uid)
            if (!result) {
                let t = await createUser({
                    email: userRecord.email,
                    photoURL: userRecord.photoURL,
                    uid: userRecord.uid
                })
                return res.json(t)
            } else {
                return res.send('login')
            }
        } catch (err) {
            return res.status(401)
                .send(err)
        }
    }
    static async createUserByUID(req: Request, res: Response) {
        let token: any = req.headers.idtoken
        let uid = await verify(token)
        let userRecord = await admin.auth().getUser(uid)
        try {
            await createUser({
                email: userRecord.email,
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
        let token = req.headers.idtoken
        let { info } = req.body
        try {
            if (typeof (token) !== "string") {
                throw new Error("invalid token type")
            }
            let uid = await verify(token)
            let userRecord = await admin.auth().getUser(uid)
            await updateUser(userRecord.uid, info);
            return res.status(202)
                .send('updated')
        } catch (err) {
            console.log(err);
            return res.status(401)
                .send(err)

        }
    }
    static async getAllUserwithInfo(req, res) {
        let w = await getAllUser()
        res.send(w)
    }
    static async getUserProfile(req: Request, res: Response) {
        let token = req.headers.idtoken
        if (!token) {
            return res.status(401)
                .send('Bad Request')
        }
        try {
            if (typeof (token) !== "string") {
                throw new Error("invalid token type")
            }
            let uid = await verify(token)
            let w = await getUserById(uid)
            return res.json(w)
        } catch (error) {
            console.log(error);
            return res.status(401)
                .send(error)

        }
    }
}
