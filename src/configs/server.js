import 'express-async-errors'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import pino from 'express-pino-logger'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import logger from '#configs/logger'
import routes from '#routes/index'
import authConfig from '#configs/auth'
import openApiMiddleware from '#middlewares/openapi'

const app = express()

app.use(bodyParser.json())
app.use(helmet())
app.use(cors())
app.use(pino({ logger }))
app.use(cookieParser())
app.use(authConfig)

app.use('/docs', ...openApiMiddleware)

// routes
app.use('/api', routes)

export default app