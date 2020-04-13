import express from 'express'
import { UserController } from '../controller/user.controller'

const UserRoute = express.Router()

UserRoute.get('/',UserController.getUserProfile)
UserRoute.put('/',UserController.editUserProfile)
UserRoute.get('/a',UserController.getAllUserwithInfo)

export default UserRoute