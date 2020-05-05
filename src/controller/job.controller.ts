import { Request, Response } from "express";
import admin from "firebase-admin";

import { Job } from "../interface/job.interface";
import isArrayEmpty from '../utils/isArrayEmpty'
import verify from "../utils/verify";
import { createJob, getAvailableJobForUser, JobModel, updateJob } from "../model/job.model";
import { addSelected, getSelectedUser, getSelectingUser, SelectedModel, updateSelected } from "../model/selected.model";
import { getUserById, getAvailableUserForJob } from "../model/user.model";
import { checkIfOwner } from "../utils/checkIsOwner";
import { Types, mongo } from "mongoose";
import { addUserApply } from "../model/position.model";
import shuffle from "../utils/shuffleArray";

export class JobController {
    static async postJob(req: Request, res: Response) {
        let token = req.headers.idtoken;
        try {
            if (typeof (token) !== "string") {
                return res.status(401)
                    .send("invalid token type")
            }
            let info: Job = req.body;
            if (isArrayEmpty(info.positions)) {
                return res.status(401)
                    .send('Empty array of info')
            }
            let uid = await verify(token);
            let userRecord = await admin.auth().getUser(uid);

            if ((!userRecord.email || !userRecord.providerData[0].email)) {
                console.log(userRecord.email, userRecord.providerData[0].email, 'email');
                return res.status(401)
                    .send('Bad request')
            }
            let job = await createJob(userRecord.email || userRecord.providerData[0].email, info);
            res.json(job)
        } catch (error) {
            console.log(error);
            res.status(402)
                .send(error)
        }
    }


    static async editJob(req: Request, res: Response) {
        let info = req.body;
        if (!info) {
            return res.status(401)
                .send('Bad request')
        }
        let id = req.params['id'];
        if (!id) {
            return res.status(401)
                .send('Bad request')
        }

        try {
            let job = await updateJob(id, info);
            return res.json(job)
        } catch (error) {
            return res.status(401)
                .send(error)
        }

    }

    static async responseJobByUser(req: Request, res: Response) {
        let jobId = req.params['id'];
        let token = req.headers.idtoken;
        let status = req.query.status
        try {
            if (typeof (token) !== "string") {
                return res.status(401)
                    .send("invalid token type")
            }
            let uid = await verify(token);
            let user = await getUserById(uid)
            let updated = await updateSelected(jobId, user._id, status);
            if (status === 'cancle' && updated['job']['mode'] === 'auto') {
                let newUsers = await getAvailableUserForJob(updated['job']._id, {})
                let newUser = shuffle(newUsers).pop()
                let oid = Types.ObjectId(updated._id)
                user['selectedBy'] = user['selectedBy'].filter(v => !oid.equals(v._id))
                await user.save()
                updated = await SelectedModel.findById(updated._id)
                updated['user'] = newUser._id
                updated['status'] = 'inviting'
                await updated.save()
            } else if (status === 'accept') {
                user['selectedBy'].push(Types.ObjectId(updated._id))
                await user.save()
            }
            res.send(updated)
        } catch (error) {
            console.log(error);
            res.status(401)
                .send(error)
        }
    }

    static async getUserByJobId(req: Request, res: Response) {
        let jobId = req.params['id'];
        let token = req.headers.idtoken;
        let status = req.query.mode
        if (typeof (token) !== "string") {
            return res.status(401)
                .send('invalid token type')
        }
        try {
            await verify(token);
            console.log(status);

            res.json(await getSelectedUser(jobId, status))
        } catch (error) {
            res.status(401)
                .send(error)
        }
    }

    static async selectUserForJob(req: Request, res: Response) {
        let token = req.headers.idtoken;
        let jobId = req.params['id']
        let info = req.body
        if (typeof (token) !== "string") {
            return res.status(401)
                .send('invalid token')
        }

        try {
            let uid = await verify(token);
            let user = await getUserById(uid)
            if (!(await checkIfOwner(user._id, jobId)))
                return res.status(404)
                    .send('error')

            let w = await updateSelected(jobId, info.userId, 'inviting')
            let w_2 = await SelectedModel.findOne({
                _id: Types.ObjectId(w._id)
            })
            w_2['waiting'] = Date.now()
            w_2['position'] = info.pos
            await w_2.save()
            res.send('invite success')
        } catch (error) {
            console.log(error);
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
            let jobs = await JobModel.find(
                mode ? { mode } : {}
            )
                .populate('owner')
                .populate({
                    path: 'positions',
                    populate: {
                        path: 'apply',
                        match: {
                            status: 'accept'
                        }
                    }
                })
            return res.send(jobs.filter(v => v['owner'].uid === uid))
        } catch (error) {
            res.status(401)
                .send(error)
        }
    }

    static async userApplyJob(req: Request, res: Response) {
        let token = req.headers.idtoken;
        let jobID = req.params.id
        let info = req.body
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
        let job = req.params.id
        let user = req.params.user

        if (typeof (token) !== "string") {
            return res.status(401)
                .send('invalid token')
        }
        try {
            let userId = new Types.ObjectId(user)
            let jobId = new Types.ObjectId(job)
            await verify(token);
            let target = await SelectedModel.findOne({
                job: jobId,
                user: userId
            })
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
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'posterId'
                    }
                })
            return res.json(job)
        } catch (error) {
            res.status(401)
                .send(error)
        }
    }

    static async getSelectingUserList(req: Request, res: Response) {
        let token = req.headers.idtoken
        let jobId = req.params.id
        if (typeof (token) !== "string") {
            return res.status(401)
                .send('invalid token')
        }
        try {
            await verify(token);
            let users = await getSelectingUser(jobId)
            return res.json(users)
        } catch (error) {
            res.status(401)
                .send(error)
        }
    }
    static async responseJobByOwner(req: Request, res: Response) {
        let jobId = req.params['id'];
        let userId = req.params['user'];
        let token = req.headers.idtoken;
        let status = req.query.status
        try {
            if (typeof (token) !== "string") {
                return res.status(401)
                    .send("invalid token type")
            }
            await verify(token);
            let a = await updateSelected(jobId, userId, status);
            if (status === 'accept') {
                let user = await getUserById(userId)
                user['selectedBy'].push(a._id)
                await user.save()
            }
            res.json(await getSelectedUser(jobId, 'applying'))
        } catch (error) {
            console.log(error);
            res.status(401)
                .send(error)
        }
    }
}
