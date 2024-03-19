import express, { Router, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { User, UserQueryParams } from '../../models/user.js'
import { loggerService } from '../../services/logger.service.js'
import { userService } from './user.service.js'

// user routes
export const userRoutes: Router = express.Router()

// middleware that is specific to this router
// userRoutes.use(requireAuth) // Uncomment if you want to require auth for all user routes

userRoutes.get('/', _getUsers)
userRoutes.get('/by-id/:id', _getUserById)
userRoutes.get('/check-username/:username', _checkUsernameAvailable)
userRoutes.get('/check-email/:email', _checkEmailAvailable)
userRoutes.post('/add/', _addUser)
userRoutes.put('/update/:id', _updateUser)
userRoutes.delete('/delete/:id', _removeUser)

// user controller functions
async function _getUsers(req: Request<{}, {}, {}, UserQueryParams>,
  res: Response): Promise<void> {
  try {
    const users = await userService.query(req.query)
    res.json(users)
  } catch (err) {
    loggerService.error('Cannot get users', err)
    res.status(500).send({ err: 'Failed to get users' })
  }
}

async function _getUserById(req: Request<{ id: ObjectId }>,
  res: Response): Promise<void> {
  try {
    const user = await userService.getById(req.params.id)
    res.json(user)
  } catch (err) {
    loggerService.error('Failed to get user', err)
    res.status(500).send({ err: 'Failed to get user' })
  }
}

async function _checkUsernameAvailable(req: Request<{ username: string }>,
  res: Response): Promise<void> {
  try {
    const userName = req.params.username
    const user = await userService.getByUsername(userName)

    if (user) loggerService.error('This username is not available: ', user.username)
    else loggerService.info('This username is available: ', userName)

    res.json({ isAvailable: !user })
  } catch (err) {
    loggerService.error('Error with checking availability of username', err)
    res.status(500).send({ err: 'Error with checking availability of username' })
  }
}

async function _checkEmailAvailable(req: Request<{ email: string }>,
  res: Response): Promise<void> {
  try {
    const userEmail = req.params.email
    const user = await userService.getByEmail(userEmail)

    if (user) loggerService.error('This email is not available: ', user.email)
    else loggerService.info('This email is available: ', userEmail)

    res.json({ isAvailable: !user })
  } catch (err) {
    loggerService.error('Error with checking availability of email', err)
    res.status(500).send({ err: 'Error with checking availability of email' })
  }
}

async function _addUser(req: Request<{}, {}, User>,
  res: Response): Promise<void> {
  try {
    const user = req.body
    loggerService.debug('Creating user:', user)
    const addedUser = await userService.save(user)

    res.json(addedUser)
  } catch (err) {
    loggerService.error('Failed to add user', err)
    res.status(500).send({ err: 'Failed to add user' })
  }
}

async function _updateUser(req: Request<{ id: ObjectId }, {}, User>,
  res: Response): Promise<void> {
  try {
    const user = { ...req.body, _id: req.params.id }
    loggerService.debug('Updating user:', user)
    const savedUser = await userService.save(user)

    res.json(savedUser)
  } catch (err) {
    loggerService.error('Failed to update user', err)
    res.status(500).send({ err: 'Failed to update user' })
  }
}

async function _removeUser(req: Request<{ id: ObjectId }>,
  res: Response): Promise<void> {
  try {
    const userId = req.params.id
    loggerService.debug('Removing user with _id: ', userId)
    await userService.remove(userId)

    res.status(200).send({ msg: 'User successfully removed' })
  } catch (err) {
    loggerService.error('Failed to delete user', err)
    res.status(400).send({ err: 'Failed to delete user' })
  }
}