import express from 'express'
import { UserController } from '../controller/user.controller'

const UserRoute = express.Router()

UserRoute.get('/',UserController.getUserProfile)
UserRoute.put('/',UserController.editUserProfile)
UserRoute.get('/all',UserController.getAllUserWithInfo)
UserRoute.get('/:id',UserController.getUserProfileById)

export default UserRoute


