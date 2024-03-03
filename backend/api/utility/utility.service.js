import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import fs from 'fs'
import { ObjectId } from 'mongodb'

import { loggerService } from '../../services/logger.service.js'

export const utilityService = {
    sendContactUsMail,
    sendVerificationMail,
    verifyRecaptcha,
    readJsonFile,
    makeId,
    idToObjectId
}
dotenv.config()

// routed functions
async function sendContactUsMail(name, email, title, message, recaptchaToken) {
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
        text: `${message},This message was sent by ${name}.Contact him back via this email: ${email}, or by pressing the Reply button.`,
        html: `<p>${message}</p>
               <hr>
               <p>This message was sent by <b>${name}</b>.</p>
               <p>Contact him back via the email <b>${email}</b>, or by pressing the Reply button.</p>`
    }
    try {
        await transporter.sendMail(mailOptions)
        loggerService.debug('Email sent successfully')
    } catch (error) {
        loggerService.error('Error sending email:', error)
        throw error
    }
}

async function sendVerificationMail(username, email, code) {
    loggerService.debug(`Sending auth email containing: ${username}, ${email}, ${code}`)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_GMAIL_ADDRESS,
            pass: process.env.SENDER_GMAIL_PASSWORD
        }
    })
    let mailOptions = {
        from: process.env.SENDER_GMAIL_ADDRESS,
        to: email,
        subject: `Verify your account`,
        text: `Dear ${username}, To verify your account, please use the following code: ${code}. If you did not request this, please ignore this email.`,
        html: `<p>Dear ${username},</p>
               <p>To verify your account, please use the following code:</p>
               <p><b>${code}</b></p>
               <p>If you did not request this, please ignore this email.</p>
               <p>Thank you,<br>The Ori-Carlin support team</p>`
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

// non routed functions
function readJsonFile(path) {
    const str = fs.readFileSync(path, 'utf8')
    const json = JSON.parse(str)
    return json
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function idToObjectId(oldId) {
    let newId = oldId
    if (typeOf(newId) === 'object') {
        if (newId.length !== 0) newId = newId.map((aId) => aId = new ObjectId(aId))
        else newId._id = ObjectId(newId._id)

    } else newId = ObjectId(newId)
    return newId
}