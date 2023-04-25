import { Router } from 'express'
import userController from '../controllers/user.controller'

const api = Router()
api.use(userController)

export default Router().use('', api)
