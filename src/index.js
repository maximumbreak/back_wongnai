import Contatns from './constants'
import express from 'express'
import path from 'path'

const app = express()

const expressSwagger = require('express-swagger-generator')(app)
const port = Contatns.PORT
import routes from './routes/index'
import bodyParser from 'body-parser'

import connectDB from './databases/mongodb'
import SyncCSV from './syncCsv'

let options = {
  swaggerDefinition: {
    info: {
      description: 'This is a sample server',
      title: 'Swagger',
      version: '1.0.0',
    },
    host: 'localhost:5000',
    basePath: '',
    produces: ['application/json', 'application/xml'],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: '',
      },
    },
  },
  basedir: __dirname, //app absolute path
  files: ['./routes/*.js'], //Path to the API handle folder
}
expressSwagger(options)

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

app.set('views', __dirname + '/views')
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use('/static', express.static(path.join(__dirname, 'asset')))
// Add headers
app.use(function (req, res, next) {
  var allowedOrigins = ['http://localhost:3000']
  var origin = req.headers.origin
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  )

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type,Authorization'
  )

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)

  // Pass to next layer of middleware
  next()
})
app.use('/', routes)

connectDB.then(async () => {
  // httpServer.listen(port, () => console.log(`running on port ${port}!`))
  // httpsServer.listen(portSsl, () => console.log(`running on port ${portSsl}!`))
  await SyncCSV()
  app.listen(port, () => console.log(`running on port ${port}!`))
})

export default app
