import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'

const USERS_COLLECTION = 'user'

export const userService = {
  query,
  remove,
  save,
  getById,
  getByUsername,
}

async function query(filterBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection(USERS_COLLECTION)
    const users = await collection.find(criteria).toArray()
    // console.log(users)
    return users
  } 
  catch (err) {
    loggerService.error('cannot find users', err)
    throw err
  }
}

async function getByUsername(username) {
  try {
    const collection = await dbService.getCollection(USERS_COLLECTION)
    const user = await collection.findOne({ username })
    return user
  } 
  catch (err) {
    logger.error(`while finding user by username: ${username}`, err)
    throw err
  }
}

async function getById(userId) {
  try {
    const collection = await dbService.getCollection(USERS_COLLECTION)
    const user = collection.findOne({ _id: new ObjectId(userId) })
    return user
  } 
  catch (err) {
    loggerService.error(`while finding user ${userId}`, err)
    throw err
  }
}

async function remove(userId) {
  try {
    const collection = await dbService.getCollection(USERS_COLLECTION)
    const { deletedCount } = await collection.deleteOne({ _id: new ObjectId(userId) })
    if (deletedCount === 0) {
      throw new Error(`User with id ${userId} was not found`)
    }
    return deletedCount
  } 
  catch (err) {
    loggerService.error(`cannot remove user ${userId}`, err)
    throw err
  }
}

async function save(user) {
  const collection = await dbService.getCollection(USERS_COLLECTION)

  if (user._id) {
    try {
      const userToSave = { ...user }
      const id = user._id
      delete userToSave._id

      const response = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: userToSave }
      )
      if (response.matchedCount === 0) {
        throw new Error(`User with id ${id} was not found`)
      }
      return { _id: id, ...userToSave }
    } 
    catch (err) {
      loggerService.error(`cannot update user ${user._id}`, err)
      throw err
    }
  }
  else {
    try {
      const response = await collection.insertOne(user)
      return { ...user, _id: response.insertedId }
    } 
    catch (err) {
      loggerService.error('cannot insert user', err)
      throw err
    }
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}
  if (filterBy.userId) criteria.userId = filterBy.userId
  return criteria
}