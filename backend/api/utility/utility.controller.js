import { loggerService } from '../../services/logger.service.js'
import { utilityService } from './utility.service.js'

export async function sendContactUsMail(req, res) {
    const { name, email, title, message, recaptchaToken } = req.body
    loggerService.debug(`Received contact form data: ${name}, ${email}, ${title}, ${message}, ${recaptchaToken}`)

    try {
        await utilityService.sendContactUsMail(name, email, title,
            message, recaptchaToken)
        res.status(200).end()
    } catch (error) {
        loggerService.error('Failed sending mail:' + error)
        res.status(500).json({ error: 'Failed sending mail' })
    }
}

export async function sendVerificationMail(req, res) {
    const { username, email, code } = req.body
    loggerService.debug(`Received verify form data: ${username}, ${email}, ${code}`)

    try {
        await utilityService.sendVerificationMail(username, email, code)
        res.status(200).end()
    } catch (error) {
        loggerService.error('Failed sending mail:' + error)
        res.status(500).json({ error: 'Failed sending mail' })
    }
}