import { Router } from 'express'
import prisma from '../prisma/client'
const router = Router()

router.get('/users', async (req, res, next) => {
  try {
    // const options = getOptions(req);
    // const events = await getEvents(options);

    res.send('hello users')
  } catch (error) {
    next(error)
  }
})

router.post('/users', async (req, res, next) => {
  try {
    console.log(req.body)
    res.json('sent')
  } catch (error) {
    next(error)
  }
})

export default router
