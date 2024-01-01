import { loggerService } from '../../services/logger.service.js'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

export const utilityService = {
    sendMail
}
dotenv.config()

async function sendMail(name, email, title, message) {
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
