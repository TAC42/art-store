import express, { Router } from 'express'
import { login, signup, logout } from './auth.controller.js'

export const authRoutes: Router = express.Router()

authRoutes.post('/login', login)
authRoutes.post('/signup', signup)
authRoutes.post('/logout', logout)