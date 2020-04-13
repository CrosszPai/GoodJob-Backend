import express from 'express'
import { JobController } from '../controller/job.controller'
import { CommentController } from '../controller/comment.controller'

const JobRoute = express.Router()

JobRoute.post('/',JobController.postJob)
JobRoute.put('/:id',JobController.editJob)
JobRoute.post('/:id/comment',CommentController.postComment)
JobRoute.get('/',JobController.testJob)
JobRoute.put('/:id/accept',JobController.acceptjob)
JobRoute.get('/:id/av',JobController.simulate)

export default JobRoute