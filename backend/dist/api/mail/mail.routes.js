import express from 'express';
import { sendContactUsMail, sendVerificationMail } from './mail.controller.js';
export const mailRoutes = express.Router();
mailRoutes.post('/contact', sendContactUsMail);
mailRoutes.post('/verify', sendVerificationMail);
