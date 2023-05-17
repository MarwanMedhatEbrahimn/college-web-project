const express = require('express')
const path = require('path')
const cors = require('cors')
const routes = require('./routes/routes')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')

dotenv.config()
const app = express()
const port = process.env.PORT || 8000
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(session({ secret: 'mysecretkey' }))


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

const corsOptions = {
  origin: '*'
}
app.use(function (req, res, next) {
  req.active = req.path.split('/')[1] // [0] will be empty since routes start with '/'
  next()
})

app.use(cors(corsOptions))

app.use(function (req, res, next) {
  if(req.session.user) {
    res.locals.user = req.session.user
  }else {
    res.locals.user = {name: ""}
  }
  next()
})

app.use(routes)

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
