import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { loggerService } from './services/logger.service.js'
import http from 'http'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()
const app = express()

app.use(cookieParser()) // for res.cookies
app.use(express.json()) // for req.body
// app.use(express.static('public'))

if (process.env.NODE_ENV === 'production') {
  // Express serve static files on production environment
  app.use(express.static(path.resolve(__dirname, 'public', 'browser')))
} else {
  // Configuring CORS
  const corsOptions = {
    // Make sure origin contains the url your frontend is running on
    origin: [
      'https://oricarlin.onrender.com',
      'http://127.0.0.1:4200',
      'http://localhost:4200',
      'http://127.0.0.1:3030',
      'http://localhost:3030',
    ],
    credentials: true,
  }
  app.use(cors(corsOptions))
}

import { productRoutes } from './api/product/product.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'
import { utilRoutes } from './api/utility/utility.routes.js'
import { setupSocketAPI } from './services/socket.service.js'

app.use('/api/product', productRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/utility', utilRoutes)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'browser', 'index.html'))
})

const port = process.env.PORT || 3030
const server = http.createServer(app)
setupSocketAPI(server)

server.listen(port, () => {
  loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
})