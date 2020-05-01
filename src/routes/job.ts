import express from 'express'
import {JobController} from '../controller/job.controller'
import {CommentController} from '../controller/comment.controller'

const JobRoute = express.Router();

JobRoute.get('/', JobController.getAllJob)
JobRoute.post('/', JobController.postJob);
JobRoute.get('/:id',JobController.getJobInfo)
JobRoute.put('/:id', JobController.editJob);
JobRoute.post('/:id/comment', CommentController.postComment);
JobRoute.put('/:id/comment', CommentController.replyComment);
JobRoute.put('/:id/accept', JobController.acceptJob);
JobRoute.get('/:id/users', JobController.getAllUserByJobId);
JobRoute.put('/:id/select', JobController.selectUserForJob)
JobRoute.put('/:id/end/:user', JobController.confirmSuccessJob)
JobRoute.post('/:id/apply',JobController.userApplyJob)
JobRoute.get('/available', JobController.getAvailableJob)

export default JobRoute
