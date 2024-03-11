import nodemailer from 'nodemailer'
import { MailOptions } from '../../models/utility.js'
import { loggerService } from '../../services/logger.service.js'
import { utilityService } from '../../services/utility.service.js'

export const mailService = {
    sendContactUsMail,
    sendVerificationMail,
}

async function sendContactUsMail(name: string, email: string, title: string, message: string, recaptchaToken: string): Promise<void> {
    await utilityService.verifyRecaptcha(recaptchaToken)

    loggerService.debug(`Sending email containing: ${name}, ${email}, ${title}, ${message}`)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_GMAIL_ADDRESS ?? '',
            pass: process.env.SENDER_GMAIL_PASSWORD ?? '',
        },
    })
    const mailOptions: MailOptions = {
        from: process.env.SENDER_GMAIL_ADDRESS ?? '',
        to: process.env.RECEIVER_EMAIL_ADDRESS ?? '',
        replyTo: email,
        subject: `From ${name}, topic: ${title}`,
        text: `${message}, This message was sent by ${name}. Contact him back via this email: ${email}, or by pressing the Reply button.`,
        html: `<p>${message}</p>
               <hr>
               <p>This message was sent by <b>${name}</b>.</p>
               <p>Contact him back via the email <b>${email}</b>, or by pressing the Reply button.</p>`,
    }
    try {
        await transporter.sendMail(mailOptions)
        loggerService.debug('Email sent successfully')
    } catch (error) {
        loggerService.error('Error sending email:', error)
        throw error
    }
}

async function sendVerificationMail(username: string, email: string, code: string): Promise<void> {
    loggerService.debug(`Sending auth email containing: ${username}, ${email}, ${code}`)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_GMAIL_ADDRESS ?? '',
            pass: process.env.SENDER_GMAIL_PASSWORD ?? '',
        },
    })
    const mailOptions: MailOptions = {
        from: process.env.SENDER_GMAIL_ADDRESS ?? '',
        to: email,
        subject: `Verify your account`,
        text: `Dear ${username}, To verify your account, please use the following code: ${code}. If you did not request this, please ignore this email.`,
        html: `<p>Dear ${username},</p>
               <p>To verify your account, please use the following code:</p>
               <p><b>${code}</b></p>
               <p>If you did not request this, please ignore this email.</p>
               <p>Thank you,<br>The Support Team</p>`,
    }
    try {
        await transporter.sendMail(mailOptions)
        loggerService.debug('Email sent successfully')
    } catch (error) {
        loggerService.error('Error sending email:', error)
        throw error
    }
}