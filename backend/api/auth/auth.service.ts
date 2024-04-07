import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { User } from '../../models/user.js'
import { userService } from '../user/user.service.js'
import { loggerService } from '../../services/logger.service.js'

export const authService = {
  signup,
  login,
  getLoginToken,
  validateToken,
  checkPassword,
  hashPassword
}
dotenv.config()

const cryptr = new Cryptr(process.env.DECRYPTION!)

async function login(loginId: string, password: string): Promise<User | null> {
  loggerService.debug(`auth - login with loginId: ${loginId}`)

  const user = loginId.includes('@')
    ? await userService.getByEmail(loginId)
    : await userService.getByUsername(loginId)

  if (!user) throw new Error('Invalid loginId or password')

  const match = await bcrypt.compare(password, user.password!)
  if (!match) throw new Error('Invalid loginId or password')

  return user
}

async function signup(username: string, password: string, fullName: string, email?: string, imgUrl?: string[]): Promise<User> {
  loggerService.debug(`auth - signup with username: ${username}`)

  if (!username || !password || !fullName) throw new Error('Missing required details')
  const hash = await hashPassword(password)

  return userService.save({
    username,
    password: hash,
    fullName,
    email,
    imgUrl,
    cart: [],
    createdAt: Date.now(),
    isAdmin: false,
    isVerified: false,
  })
}

async function checkPassword(password: string): Promise<string> {
  const isPasswordHashed = /^[$]2[aby][$]/.test(password)
  if (!isPasswordHashed) return await hashPassword(password)
  return password
}

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  const hash = await bcrypt.hash(password, saltRounds)
  return hash
}

function getLoginToken(user: User): string {
  const userInfo: User = {
    _id: user._id!,
    username: user.username,
  }
  return cryptr.encrypt(JSON.stringify(userInfo))
}

function validateToken(loginToken: string): User | null {
  try {
    const json = cryptr.decrypt(loginToken)
    const loggedInUser: User = JSON.parse(json)
    return loggedInUser
  } catch (err) {
    loggerService.error('Invalid login token')
  }
  return null
}