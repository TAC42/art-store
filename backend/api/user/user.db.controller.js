import { loggerService } from '../../services/logger.service.js'
import { userService } from '../user/user.db.service.js'

export async function getUser(req, res) {
  try {
    const user = await userService.getById(req.params.id)
    res.send(user)
  }
  catch (err) {
    loggerService.error('Failed to get user', err)
    res.status(500).send({ err: 'Failed to get user' })
  }
}

export async function getUsers(req, res) {
  try {
    const users = await userService.query(req.query)
    res.send(users)
  }
  catch (err) {
    loggerService.error('Cannot get users', err)
    res.status(500).send({ err: 'Failed to get users' })
  }
}

export async function removeUser(req, res) {
  try {
    await userService.remove(req.params.id)
    res.send({ msg: 'Deleted successfully' })
  }
  catch (err) {
    logger.error('Failed to delete user', err)
    res.status(400).send({ err: 'Failed to delete user' })
  }
}

export async function addUser(req, res) {
  try {
    const user = req.body
    const addedUser = await userService.save(user)
    res.send(addedUser)
  }
  catch (err) {
    loggerService.error('Failed to add user', err)
    res.status(500).send({ err: 'Failed to add user' })
  }
}

export async function updateUser(req, res) {
  try {
    const user = { ...req.body, _id: req.params.id }
    const savedUser = await userService.save(user)
    res.send(savedUser)
  }
  catch (err) {
    logger.error('Failed to update user', err)
    res.status(500).send({ err: 'Failed to update user' })
  }
}