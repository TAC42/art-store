import nodemailer, { Transporter } from 'nodemailer'
import { MailOptions } from '../models/utility.js'
import { loggerService } from './logger.service.js'

export const mailUtilService = {
    prepareEmailBody,
    sendEmail,
}

// generic function for preparing a somewhat neat looking email
function prepareEmailBody(emailHtml: string): string {
    const siteLogo = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1716147351/qksbcflgrftel1b99g2z.png'
    return `
    <div style="display: flex; height: 100%; margin: 0 auto; max-width:800px;">
        <div style="width: 30px; background: linear-gradient(to bottom, #8B4513, #A0522D, #D2691E, #A0522D, #8B4513);">
        </div>
        <div style="width: 100%; padding: 20px; font-size: 1rem;">
            <a href="https://oricarlin.com" style="display: block; width: fit-content; margin: 0 auto;">
                <img src="${siteLogo}" alt="Ori Carlin" style="height: 50px; width: 50px;">
            </a>
            ${emailHtml}
            <p>Sincerely,<br>The Ori Carlin Team<br></p>
        </div>
        <div style="width: 30px; background: linear-gradient(to bottom, #FFA07A, #E9967A, #CD5C5C, #E9967A, #FFA07A);">
        </div>
    </div>`
}

// generic function to send emails using your MailOptions interface
async function sendEmail(mailOptions: MailOptions): Promise<void> {
    const transporter = _createTransporter()
    try {
        await transporter.sendMail(mailOptions)
        loggerService.debug('Email sent successfully')
    } catch (error) {
        loggerService.error('Error sending email:', error)
        throw error
    }
}

// utility function to create and return a transporter
function _createTransporter(): Transporter {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_GMAIL_ADDRESS ?? '',
            pass: process.env.SENDER_GMAIL_PASSWORD ?? '',
        },
    })
}