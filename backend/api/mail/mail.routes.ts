import express, { Router } from 'express'
import { sendContactUsMail, sendVerificationMail } from './mail.controller.js'

export const mailRoutes: Router = express.Router()

mailRoutes.post('/contact', sendContactUsMail)
mailRoutes.post('/verify', sendVerificationMail)