import { loggerService } from '../../services/logger.service.js'
import { utilityService } from './utility.service.js'

export async function sendMail(req, res) {
    const { name, email, title, message } = req.body
    loggerService.debug(`Received contact form data: ${name}, ${email}, ${title}, ${message}`)

    try {
        await utilityService.sendMail(name, email, title, message)
        res.status(200).end()
    } catch (error) {
        loggerService.error('Failed sending mail:' + error)
        res.status(500).json({ error: 'Failed sending mail' })
    }
}
