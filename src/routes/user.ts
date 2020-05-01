import express from 'express'
import {UserController} from '../controller/user.controller'

const UserRoute = express.Router()

UserRoute.get('/', UserController.getUserProfile)
UserRoute.put('/', UserController.editUserProfile)
UserRoute.get('/all', UserController.getAllUserWithInfo)
UserRoute.get('/:id', UserController.getUserProfileById)
UserRoute.get('/job', UserController.getUserJobByStatus)
UserRoute.get('/job/:id', UserController.getUserJobPosition)

export default UserRoute


