import fs from 'fs'
import { ObjectId } from 'mongodb'

import { loggerService } from './logger.service.js'

export const utilService = {
    readJsonFile,
    makeId,
    idToObjectId,
    scheduleTask
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
        if (newId.length !== 0) newId = newId.map((aId) => aId = new ObjectId(aId))
        else newId._id = ObjectId(newId._id)

    } else newId = ObjectId(newId)
    return newId
}

function scheduleTask(task, hour, minute) {
    loggerService.debug('Scheduling task called')

    const scheduleNextRun = () => {
        const now = new Date()
        let targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0)
        loggerService.info(`Target time: ${targetTime.toLocaleString()}`)

        if (now >= targetTime) {
            // If the target time for today has passed, schedule for tomorrow
            loggerService.info('Target time has passed, scheduling for tomorrow')
            targetTime.setDate(targetTime.getDate() + 1)
        }

        // Log when the next scheduled task will happen
        loggerService.info(`Next scheduled task will happen at: ${targetTime.toLocaleString()}`)

        const delay = targetTime.getTime() - now.getTime()
        loggerService.info(`Expected delay until next task: ${delay} milliseconds`)

        setTimeout(async () => {
            loggerService.info(`Scheduled task is starting at: ${new Date().toLocaleString()}`)
            try {
                await task()
                loggerService.info('Scheduled task completed.')
            } catch (err) {
                loggerService.error('Scheduled task failed:', err)
            }
            // Schedule the next run for tomorrow
            scheduleNextRun()
        }, delay)
    }
    scheduleNextRun()
}