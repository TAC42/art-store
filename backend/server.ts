import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import http from 'http'

import { productRoutes } from './api/product/product.controller.js'
import { userRoutes } from './api/user/user.controller.js'
import { authRoutes } from './api/auth/auth.controller.js'
import { mailRoutes } from './api/mail/mail.controller.js'
import { orderRoutes } from './api/order/order.controller.js'

import { loggerService } from './services/logger.service.js'
import { automationService } from './services/automation.service.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()
const app = express()

app.use(cookieParser()) // for res.cookies
app.use(express.json()) // for req.body

if (process.env.NODE_ENV === 'production') {
  // Express serve static files on production environment
  app.use(express.static(path.resolve(__dirname, '..', 'public', 'browser')))
} else {
  const corsOptions = {
    origin: [
      'http://oricarlin.com',
      'http://93.188.162.182',
      'http://127.0.0.1:4200',
      'http://localhost:4200',
      'http://127.0.0.1:3030',
      'http://localhost:3030'
    ],
    credentials: true,
  } // Configuring CORS
  app.use(cors(corsOptions))
}

app.use('/api/product', productRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/mail', mailRoutes)
app.use('/api/order', orderRoutes)
app.get('/api/paypal-client-id', (req, res) => {
  const paypalClientId = process.env.PAYPAL_CLIENT_ID
  res.json({ clientId: paypalClientId })
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'browser', 'index.html'))
})

const port = process.env.PORT || 3030
const server = http.createServer(app)

server.listen(port, () => {
  loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)

  automationService.setupOrphanedImageCheck()
  automationService.setupUnverifiedUsersCheck()
})