import {Request, Response} from "express";
import admin from "firebase-admin";

import {Job} from "../interface/job.interface";
import isArrayEmpty from '../utils/isArrayEmpty'
import verify from "../utils/verify";
import {createJob, testComment, updateJob} from "../model/job.model";
import {getSelectedUser, updateSelected} from "../model/selected.model";
import {getAvailableUser, getUserById} from "../model/user.model";

export class JobController {
    static async postJob(req: Request, res: Response) {
        let token = req.headers.idtoken;
        try {
            if (typeof (token) !== "string") {
                return res.status(401)
                    .send("invalid token type")
            }
            let info: Job = req.body.info;
            if (isArrayEmpty(info.positions)) {
                return res.status(401)
                    .send('Empty array of info')
            }
            let uid = await verify(token);
            let userRecord = await admin.auth().getUser(uid);
            let w = await getUserById(uid);
            if (!userRecord.email) {
                return res.status(401)
                    .send('Bad request')
            }
            let job = await createJob(userRecord.email, info);
            res.json(job)
        } catch (error) {
            console.log(error);
            res.status(402)
                .send(error)
        }
    }

    static async simulate(req: Request, res: Response) {
        let id = req.params['id'];
        if (typeof (id) === 'string') {
            let av = await getAvailableUser(id, {});
            res.json(av)
        }
    }

    static async editJob(req: Request, res: Response) {
        let {info} = req.body;
        if (!info) {
            return res.status(401)
                .send('Bad request')
        }
        let id = req.params['id'];
        if (!id) {
            return res.status(401)
                .send('Bad request')
        }

        let job = await updateJob(id, info);
        res.json(job)
    }

    static async testJob(req: Request, res: Response) {
        let a = await testComment();
        res.json(a)
    }

    static async acceptJob(req: Request, res: Response) {
        let jobId = req.params['id'];
        let token = req.headers.idtoken;
        try {
            if (typeof (token) !== "string") {
                return res.status(401)
                    .send("invalid token type")
            }
            let uid = await verify(token);
            let a = await updateSelected(jobId, uid, 'accept');
            res.send(a)
        } catch (error) {
            console.log(error);
            res.status(401)
                .send(error)
        }
    }

    static async getAlluserByjobId(req: Request, res: Response) {
        let jobId = req.params['id'];
        let token = req.headers.idtoken;
        if (typeof (token) !== "string") {
            return res.status(401)
                .send('invalid token type')
        }
        try {
            await verify(token);
            res.json(await getSelectedUser(jobId))
        } catch (error) {
            res.status(401)
                .send(error)
        }
    }

    static async getAvailableJob(req: Request, res: Response) {
        let token = req.headers.idtoken;
        try {
            if (typeof (token) !== "string") {
                throw new Error("invalid token type")
            }

        } catch (error) {
            res.status(401)
                .send(error)
        }
    }
}
