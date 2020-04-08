import { createJob, updateJob } from "../model/job.model";
import { Request, Response } from "express";

export class JobController {
    static async postJob(req:Request,res:Response){
        let  {email,info} = req.body
        let job = await createJob(email,info)
        res.json(job)
    }
    static async editJob(req:Request,res:Response){
        let { info } = req.body
        let id = req.params['id']
    
        let job = await updateJob(id,info)
        res.json(job)
    }
}