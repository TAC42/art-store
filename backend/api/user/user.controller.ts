import { ObjectId } from 'mongodb'
import { Request, Response } from 'express'
import { User, UserQueryParams } from '../../models/user.js'
import { loggerService } from '../../services/logger.service.js'
import { userService } from './user.service.js'

export async function getUsers(req: Request<{}, {}, {}, UserQueryParams>,
  res: Response): Promise<void> {
  try {
    const users = await userService.query(req.query)
    res.json(users)
  } catch (err) {
    loggerService.error('Cannot get users', err)
    res.status(500).send({ err: 'Failed to get users' })
  }
}

export async function getUserById(req: Request<{ id: ObjectId }>,
  res: Response): Promise<void> {
  try {
    const user = await userService.getById(req.params.id)
    res.json(user)
  } catch (err) {
    loggerService.error('Failed to get user', err)
    res.status(500).send({ err: 'Failed to get user' })
  }
}

export async function addUser(req: Request<{}, {}, User>,
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

export async function updateUser(req: Request<{ id: ObjectId }, {}, User>,
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

export async function removeUser(req: Request<{ id: ObjectId }>,
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