import express from 'express'
import { sendContactUsMail, sendVerificationMail } from './utility.controller.js'

export const utilRoutes = express.Router()

utilRoutes.post('/mail/contact', sendContactUsMail)
utilRoutes.post('/mail/verify', sendVerificationMail)