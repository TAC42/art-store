import { ObjectId } from 'mongodb';
import { dbService } from '../../services/db.service.js';
import { loggerService } from '../../services/logger.service.js';
const USERS_COLLECTION = 'user';
export const userService = {
    query,
    remove,
    save,
    getById,
    getByUsername,
    checkNonVerifiedUsers,
};
async function query(filterBy = {}) {
    try {
        const collection = await dbService.getCollection(USERS_COLLECTION);
        const pipeline = _buildPipeline(filterBy);
        return await collection.aggregate(pipeline).toArray();
    }
    catch (err) {
        loggerService.error('cannot find users', err);
        throw err;
    }
}
async function getById(userId) {
    try {
        const collection = await dbService.getCollection(USERS_COLLECTION);
        const user = await collection.findOne({ _id: new ObjectId(userId) });
        return user;
    }
    catch (err) {
        loggerService.error(`Error with finding user ${userId}`, err);
        throw err;
    }
}
async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection(USERS_COLLECTION);
        const user = await collection.findOne({ username });
        return user;
    }
    catch (err) {
        loggerService.error(`Error with finding user named: ${username}`, err);
        throw err;
    }
}
async function remove(userId) {
    try {
        const collection = await dbService.getCollection(USERS_COLLECTION);
        const { deletedCount } = await collection.deleteOne({ _id: new ObjectId(userId) });
        return deletedCount;
    }
    catch (err) {
        loggerService.error(`cannot remove user ${userId}`, err);
        throw err;
    }
}
async function save(user) {
    try {
        const collection = await dbService.getCollection(USERS_COLLECTION);
        if (user._id) {
            const id = new ObjectId(user._id.toString());
            const userToUpdate = { ...user, _id: undefined };
            const result = await collection.updateOne({ _id: id }, { $set: userToUpdate });
            if (result.matchedCount === 0)
                throw new Error(`User with id ${id} not found`);
            return { ...userToUpdate, _id: id };
        }
        else {
            const response = await collection.insertOne(user);
            return { ...user, _id: response.insertedId };
        }
    }
    catch (err) {
        loggerService.error('Failed to save user', err);
        throw err;
    }
}
function _buildPipeline(filterBy) {
    const criteria = {};
    if (filterBy.userId)
        criteria._id = new ObjectId(filterBy.userId);
    return criteria;
}
async function checkNonVerifiedUsers() {
    try {
        const collection = await dbService.getCollection(USERS_COLLECTION);
        const { deletedCount } = await collection.deleteMany({ isVerified: false });
        return deletedCount;
    }
    catch (err) {
        loggerService.error('Error while checking non-verified users', err);
        throw err;
    }
}
