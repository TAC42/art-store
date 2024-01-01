import express from 'express'
import { sendMail } from './utility.controller.js'

export const utilRoutes = express.Router()

utilRoutes.post('/mail', sendMail)