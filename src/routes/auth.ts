import express from 'express'
import { UserController } from '../controller/user.controller'

const AuthRoute = express.Router()

AuthRoute.get('/login', UserController.login)

export default AuthRoute