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
  loggerService.debug(`auth - login with username: ${username}`)

  const user = await userService.getByUsername(username)
  if (!user) throw new Error('Invalid username or password')

  const match = await bcrypt.compare(password, user.password)
  if (!match) throw new Error('Invalid username or password')

  // delete user.password
  return user
}

async function signup(username, password, fullName, email, imgUrl) {
  loggerService.debug(`auth - signup with username: ${username}`)

  if (!username || !password || !fullName) {
    throw new Error('Missing required details')
  }

  // encrypt the user's password in database
  const saltRounds = 10
  const hash = await bcrypt.hash(password, saltRounds)

  return userService.save({
    username,
    password: hash,
    fullName,
    email,
    imgUrl,
    cart: [],
    createdAt: Date.now(),
    isAdmin: false,
    isVerified: false
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
