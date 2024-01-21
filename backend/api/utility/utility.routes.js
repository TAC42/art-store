import express from 'express'
import { sendContactUsMail } from './utility.controller.js'

export const utilRoutes = express.Router()

utilRoutes.post('/mail/contact', sendContactUsMail)