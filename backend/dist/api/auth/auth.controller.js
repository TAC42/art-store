import { authService } from './auth.service.js';
import { loggerService } from '../../services/logger.service.js';
import { utilityService } from '../../services/utility.service.js';
export async function login(req, res) {
    const { username, password, recaptchaToken } = req.body;
    try {
        await utilityService.verifyRecaptcha(recaptchaToken);
        const user = await authService.login(username, password);
        const loginToken = authService.getLoginToken(user);
        loggerService.info('User login: ', loginToken);
        res.cookie('loginToken', loginToken, { httpOnly: true });
        res.json(user);
    }
    catch (err) {
        const error = err;
        loggerService.error('Failed to Login ', error);
        if (error.message === 'Invalid reCAPTCHA')
            res.status(401).send({ err: 'Invalid reCAPTCHA' });
        else
            res.status(500).send({ err: 'Failed to Login' });
    }
}
export async function signup(req, res) {
    const { username, password, fullName, email, imgUrl, recaptchaToken } = req.body;
    try {
        await utilityService.verifyRecaptcha(recaptchaToken);
        const account = await authService.signup(username, password, fullName, email, imgUrl);
        loggerService.debug(`auth.route - new account created: ${JSON.stringify(account)}`);
        const user = await authService.login(username, password);
        const loginToken = authService.getLoginToken(user);
        loggerService.info('User signup: ', loginToken);
        res.cookie('loginToken', loginToken, { httpOnly: true });
        res.json(user);
    }
    catch (err) {
        const error = err;
        loggerService.error('Failed to Login ', error);
        if (error.message === 'Invalid reCAPTCHA')
            res.status(401).send({ err: 'Invalid reCAPTCHA' });
        else
            res.status(500).send({ err: 'Failed to Signup' });
    }
}
export async function logout(req, res) {
    try {
        res.clearCookie('loginToken');
        res.status(200).send({ msg: 'Logged out successfully' });
    }
    catch (err) {
        loggerService.error('Failed to logout ', err);
        res.status(500).send({ err: 'Failed to logout' });
    }
}
