import { authService } from './auth.service.js'
import { loggerService } from '../../services/logger.service.js'

export async function login(req, res) {
  const { username, password } = req.body
  try {
    const user = await authService.login(username, password)
    const loginToken = authService.getLoginToken(user)

    loggerService.info('User login: ', user)
    res.cookie('loginToken', loginToken)

    res.json(user)
  } catch (err) {
    loggerService.error('Failed to Login ' + err)
    res.status(401).send({ err: 'Failed to Login' })
  }
}

export async function signup(req, res) {
  try {
    const { username, password, fullName, imgUrl } = req.body

    const account = await authService.signup(
      username,
      password,
      fullName,
      imgUrl
    )
    loggerService.debug(
      `auth.route - new account created: ` + JSON.stringify(account)
    )

    const user = await authService.login(username, password)
    const loginToken = authService.getLoginToken(user)

    res.cookie('loginToken', loginToken)
    res.json(user)
  } catch (err) {
    loggerService.error('Failed to signup ' + err)
    res.status(500).send({ err: 'Failed to signup' })
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie('loginToken')
    res.send({ msg: 'Logged out successfully' })
  } catch (err) {
    res.status(500).send({ err: 'Failed to logout' })
  }
}
