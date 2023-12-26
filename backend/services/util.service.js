import fs from 'fs'
import { ObjectId } from 'mongodb'

export const utilService = {
    readJsonFile,
    makeId,
    idToObjectId
}

function readJsonFile(path) {
    const str = fs.readFileSync(path, 'utf8')
    const json = JSON.parse(str)
    return json
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function idToObjectId(oldId) {
    let newId = oldId
    if (typeOf(newId) === 'object') {
        if (newId.length !== 0) {
            newId = newId.map((aId) => aId = new ObjectId(aId))
        } else {
            newId._id = ObjectId(newId._id)
        }
    } else {
        newId = ObjectId(newId)
    }
    return newId
}