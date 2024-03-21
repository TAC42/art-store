import { ObjectId } from 'mongodb'
import { User, UserQueryParams } from '../../models/user.js'
import { dbService } from '../../services/db.service.js'
import { authService } from '../../api/auth/auth.service.js'
import { loggerService } from '../../services/logger.service.js'

const USERS_COLLECTION = 'user'

export const userService = {
  query,
  remove,
  save,
  getById,
  getByUsername,
  getByEmail,
  checkNonVerifiedUsers,
}

async function query(filterBy: UserQueryParams = {}): Promise<User[]> {
  try {
    const collection = await dbService.getCollection(USERS_COLLECTION)
    const pipeline = _buildPipeline(filterBy)

    return await collection.aggregate<User>(pipeline).toArray()
  } catch (err) {
    loggerService.error('cannot find users', err)
    throw err
  }
}

async function getById(userId: ObjectId): Promise<User | null> {
  try {
    const collection = await dbService.getCollection(USERS_COLLECTION)

    const user = await collection.findOne<User>(
      { _id: new ObjectId(userId) })
    return user
  } catch (err) {
    loggerService.error(`Error with finding user ${userId}`, err)
    throw err
  }
}

async function getByUsername(username: string): Promise<User | null> {
  try {
    const collection = await dbService.getCollection(USERS_COLLECTION)
    const user = await collection.findOne({ username })

    return user
  } catch (err) {
    loggerService.error(`Error with finding user named: ${username}`, err)
    throw err
  }
}

async function getByEmail(email: string): Promise<User | null> {
  try {
    const collection = await dbService.getCollection(USERS_COLLECTION)
    const user = await collection.findOne({ email })

    return user
  } catch (err) {
    loggerService.error(`Error with finding user with email: ${email}`, err)
    throw err
  }
}

async function remove(userId: ObjectId): Promise<number> {
  try {
    const collection = await dbService.getCollection(USERS_COLLECTION)
    const { deletedCount } = await collection.deleteOne({ _id: new ObjectId(userId) })

    return deletedCount
  } catch (err) {
    loggerService.error(`cannot remove user ${userId}`, err)
    throw err
  }
}

async function save(user: User): Promise<User> {
  const collection = await dbService.getCollection(USERS_COLLECTION)

  try {
    if (user._id) {
      const { _id, ...userToUpdate } = user
      const id = _id instanceof ObjectId ? _id : new ObjectId(_id)

      if (userToUpdate.password) {
        userToUpdate.password = await authService.checkPassword(userToUpdate.password)
      }
      const result = await collection.updateOne(
        { _id: id }, { $set: userToUpdate })

      if (result.matchedCount === 0) throw new Error(`User with id ${id.toHexString()} not found`)

      return { ...userToUpdate, _id: id }
    } else {
      const response = await collection.insertOne(user)
      return { ...user, _id: response.insertedId }
    }
  } catch (err) {
    loggerService.error('Failed to save user', err)
    throw err
  }
}

function _buildPipeline(filterBy: UserQueryParams): any {
  const criteria: any = {}
  if (filterBy.userId) criteria._id = new ObjectId(filterBy.userId)

  return criteria
}

async function checkNonVerifiedUsers(): Promise<number> {
  try {
    const collection = await dbService.getCollection(USERS_COLLECTION)
    const { deletedCount } = await collection.deleteMany({ isVerified: false })

    return deletedCount
  } catch (err) {
    loggerService.error('Error while checking non-verified users', err)
    throw err
  }
}