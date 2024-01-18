import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

import { userService } from '../user/user.db.service.js'
import { loggerService } from '../../services/logger.service.js'

export const authService = {
  signup,
  login,
  getLoginToken,
  validateToken,
}
dotenv.config()
const cryptr = new Cryptr(process.env.DECRYPTION)

async function login(username, password) {
  loggerService.debug(`auth.service - login with username: ${username}`)

  const user = await userService.getByUsername(username)
  if (!user) throw new Error('Invalid username or password')

  const match = await bcrypt.compare(password, user.password)
  if (!match) throw new Error('Invalid username or password')

  // delete user.password
  return user
}
async function signup(
  username,
  password,
  fullName,
  email,
  imgUrl,
  isAdmin = false
) {
  loggerService.debug(`auth.service - signup with username: ${username}`)

  const saltRounds = 10

  if (!username || !password || !fullName) {
    throw new Error('Missing required details')
  }

  const hash = await bcrypt.hash(password, saltRounds)

  return userService.save({
    username,
    password: hash,
    fullName,
    email,
    imgUrl,
    createdAt: Date.now(),
    isAdmin,
    cart: [],
  })
}

function getLoginToken(user) {
  const userInfo = {
    _id: user._id,
    username: user.username,
    cart: user.cart,
    imgUrl: user.imgUrl,
  }
  return cryptr.encrypt(JSON.stringify(userInfo))
}

function validateToken(loginToken) {
  try {
    const json = cryptr.decrypt(loginToken)
    const loggedinUser = JSON.parse(json)
    return loggedinUser
  } catch (err) {
    console.log('Invalid login token')
  }
  return null
}
