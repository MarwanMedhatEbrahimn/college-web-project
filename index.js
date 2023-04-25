import express from 'express'
import path from 'path'
import cors from 'cors'
import routes from './routes/routes'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
const app = express()
const port = process.env.PORT || 8000

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())
const corsOptions = {
  origin: '*'
}
app.use(cors(corsOptions))
// app.use(routes)

// error hanlding middleware
app.use((err, req, res, next) => {
  // @ts-ignore
  if (err && err.errorCode) {
    // @ts-ignore
    res.status(err.errorCode).json({ code: err.errCode, message: err.message })
  } else if (err) {
    console.log(err)
    res.status(500).json({ code: 500, message: 'something went wrong' })
  }
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
