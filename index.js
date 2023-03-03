const express = require('express')
const app = express()

app.get('/', (_req, res) => {
  res.send('Hello World!')
})

app.get('/test', (_req, res) => {
  res.send('test2')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
