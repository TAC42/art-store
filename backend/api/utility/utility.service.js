import { loggerService } from '../../services/logger.service.js'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

export const utilityService = {
    sendMail,
    verifyRecaptcha
}
dotenv.config()

async function sendMail(name, email, title, message, recaptchaToken) {
    const isCaptchaValid = await verifyRecaptcha(recaptchaToken)
    if (!isCaptchaValid) throw new Error('Invalid reCAPTCHA')

    loggerService.debug(`Sending email containing: ${name}, ${email}, ${title}, ${message}`)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_GMAIL_ADDRESS,
            pass: process.env.SENDER_GMAIL_PASSWORD
        }
    })

    let mailOptions = {
        from: process.env.SENDER_GMAIL_ADDRESS,
        to: process.env.RECEIVER_EMAIL_ADDRESS,
        replyTo: email,
        subject: `From ${name}, topic: ${title}`,
        text: `${message}\n\nThis message was sent by ${name}.\nContact him back via this email: ${email}, or by pressing the Reply button.`
    }

    try {
        await transporter.sendMail(mailOptions)
        loggerService.debug('Email sent successfully')
    } catch (error) {
        loggerService.error('Error sending email:', error)
        throw error
    }
}

async function verifyRecaptcha(token) {
    loggerService.debug('received recaptcha token:', token)

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
    })
    const data = await response.json()
    loggerService.debug('reCAPTCHA API response:', data)

    if (!data.success) {
        loggerService.error('reCAPTCHA verification failed:', data['error-codes'])
        return false
    } else return data.success
}