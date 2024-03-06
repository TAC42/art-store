import mongoDB from 'mongodb'
const { MongoClient } = mongoDB
import { config } from '../config/index.js'
import { loggerService } from './logger.service.js'

// Define a type for the MongoDB connection
type DbConnection = mongoDB.Db | null

export const dbService = {
    getCollection,
}

let dbConn: DbConnection = null

async function getCollection(collectionName: string): Promise<mongoDB.Collection> {
    try {
        const db = await _connect()
        const collection = db.collection(collectionName)
        return collection
    } catch (err) {
        loggerService.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function _connect(): Promise<mongoDB.Db> {
    if (dbConn) return dbConn
    try {
        const client = await MongoClient.connect(config.dbURL)
        const db = client.db(config.dbName)
        dbConn = db
        return db
    } catch (err) {
        loggerService.error('Cannot Connect to DB', err)
        throw err
    }
}