import express from 'express'
import { JobController } from '../controller/job.controller'
import { CommentController } from '../controller/comment.controller'

const JobRoute = express.Router();

JobRoute.get('/', JobController.getAvailableJob)
JobRoute.post('/', JobController.postJob);
JobRoute.put('/:id', JobController.editJob);
JobRoute.post('/:id/comment', CommentController.postComment);
JobRoute.put('/:id/comment', CommentController.replyComment);
JobRoute.put('/:id/accept', JobController.acceptJob);
JobRoute.get('/:id/users', JobController.getAllUserByJobId);
JobRoute.put('/:id/select', JobController.selectUserForJob)

export default JobRoute
