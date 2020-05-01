import {Request, Response} from "express";
import admin from "firebase-admin";

import {Job} from "../interface/job.interface";
import isArrayEmpty from '../utils/isArrayEmpty'
import verify from "../utils/verify";
import {createJob, getAvailableJobForUser, JobModel, updateJob} from "../model/job.model";
import {addSelected, getSelectedUser, SelectedModel, updateSelected} from "../model/selected.model";
import {getUserById} from "../model/user.model";
import {checkIfOwner} from "../utils/checkIsOwner";

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

    static async getAllUserByJobId(req: Request, res: Response) {
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

    static async selectUserForJob(req: Request, res: Response) {
        let token = req.headers.idtoken;
        let jobId = req.params['id']
        let {info} = req.body
        if (typeof (token) !== "string") {
            return res.status(401)
                .send('invalid token')
        }

        try {
            let uid = await verify(token);
            if (!(await checkIfOwner(uid, jobId)))
                return res.status(404)
                    .send('error')
            await updateSelected(jobId, info.userId, 'inviting')
            res.send('invite success')
        } catch (error) {
            res.status(401)
                .send(error)
        }
    }

    static async getAllJob(req: Request, res: Response) {
        let token = req.headers.idtoken;
        let mode = req.query.mode
        if (typeof (token) !== "string") {
            return res.status(401)
                .send('invalid token')
        }
        try {
            let uid = await verify(token);
            let jobs = await JobModel.find({
                mode
            })
                .populate('owner')
            return res.send(jobs.filter(v => v['owner'].uid === uid))
        } catch (error) {
            res.status(401)
                .send(error)
        }
    }

    static async userApplyJob(req: Request, res: Response) {
        let token = req.headers.idtoken;
        let jobID = req.params.id
        let {info} = req.body
        if (typeof (token) !== "string") {
            return res.status(401)
                .send('invalid token')
        }
        try {
            let uid = await verify(token);
            let user = await getUserById(uid)
            await addSelected(jobID, user._id, 'applying', info.position)
            res.send('success')
        } catch (error) {
            res.status(401)
                .send(error)
        }
    }

    static async getAvailableJob(req: Request, res: Response) {
        let token = req.headers.idtoken;
        if (typeof (token) !== "string") {
            return res.status(401)
                .send('invalid token')
        }
        try {
            await verify(token);
            let jobs = await getAvailableJobForUser()
            return res.json(jobs)
        } catch (error) {
            res.status(401)
                .send(error)
        }
    }

    static async confirmSuccessJob(req: Request, res: Response) {
        let token = req.headers.idtoken
        let jobId = req.params.id
        let user = req.params.user
        if (typeof (token) !== "string") {
            return res.status(401)
                .send('invalid token')
        }
        try {
            await verify(token);
            let jobs = await SelectedModel.find({})
                .populate('job')
                .populate('user')
            let target = jobs.filter(v => v['user']._id === user && v['job'].id === jobId).pop()
            target['status'] = 'finished'
            await target.save()
            return res.send('success')
        } catch (error) {
            res.status(401)
                .send(error)
        }
    }

    static async getJobInfo(req: Request, res: Response) {
        let token = req.headers.idtoken
        let jobId = req.params.id
        if (typeof (token) !== "string") {
            return res.status(401)
                .send('invalid token')
        }
        try {
            await verify(token);
            let job = await JobModel.findById(jobId)
                .populate('positions')
                .populate('owner')
                .populate('comments')
                .populate('created')
                .populate('updated')
            return res.json(job)
        } catch (error) {
            res.status(401)
                .send(error)
        }
    }
}
