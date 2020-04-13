import { createJob, updateJob, testComment, ajob } from "../model/job.model";
import { Request, Response } from "express";
import verify from "../utils/verify";
import { getUserById, getAvailableUser } from "../model/user.model";
import admin from "firebase-admin";
import { addSelected, updateSelected } from "../model/selected.model";

export class JobController {
    static async postJob(req: Request, res: Response) {
        let token = req.headers.idtoken
        try {
            if (typeof (token) !== "string") {
                throw new Error("invalid token type")
            }
            let { info } = req.body
            let uid = await verify(token)
            let userRecord = await admin.auth().getUser(uid)
            let w = await getUserById(uid)
            if (!userRecord.email) {
                return res.status(401)
                    .send('Bad request')
            }
            let job = await createJob(userRecord.email, info)
            res.json(job)
        } catch (error) {
            console.log(error);
            res.status(402)
                .send(error)
        }
    }
    static async simulate(req: Request, res: Response) {
        let id = req.params['id']
        if (typeof(id) === 'string') {
            let av = await getAvailableUser(id,{})
            res.json(av)
        }
    }
    static async editJob(req: Request, res: Response) {
        let { info } = req.body
        if (!info) {
            return res.status(401)
                .send('Bad request')
        }
        let id = req.params['id']
        if (!id) {
            return res.status(401)
                .send('Bad request')
        }

        let job = await updateJob(id, info)
        res.json(job)
    }
    static async testJob(req: Request, res: Response) {
        let a = await testComment()
        res.json(a)
    }
    static async acceptjob(req: Request, res: Response) {
        let jobId = req.params['id']
        let token = req.headers.idtoken
        try {
            if (typeof (token) !== "string") {
                throw new Error("invalid token type")
            }
            let uid = await verify(token)
            let a = await updateSelected(jobId, uid, 'accept')
            res.send(a)
        } catch (error) {
            console.log(error);
            res.status(401)
                .send(error)
        }
    }
}