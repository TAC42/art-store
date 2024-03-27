import { userService } from "../api/user/user.service.js"
import { cloudinaryService } from "./cloudinary.service.js"
import { loggerService } from "./logger.service.js"

const USERS_COLLECTION = 'user'
const PRODUCTS_COLLECTION = 'product'

export const automationService = {
    setupOrphanedImageCheck,
    setupUnverifiedUsersCheck
}

function setupOrphanedImageCheck(): void {
    // Schedule task for checking redundant product images
    _scheduleTask(() => cloudinaryService.checkOrphanedImages(PRODUCTS_COLLECTION,
        ['Shop', 'Artware', 'Sculpture']), 'Orphaned Product Images Check', 22, 30)

    // Schedule task for checking redundant user images
    _scheduleTask(() => cloudinaryService.checkOrphanedImages(USERS_COLLECTION,
        ['User']), 'Orphaned User Images Check', 22, 45)
}

function setupUnverifiedUsersCheck(): void {
    _scheduleTask(userService.checkNonVerifiedUsers,
        'Non Verified Users Check', 23, 0)
}

function _scheduleTask(task: () => Promise<any>, taskName: string, hour: number, minute: number): void {
    const scheduleNextRun = () => {
        const now = new Date()
        let targetTime = new Date(now.getFullYear(), now.getMonth(),
            now.getDate(), hour, minute, 0)
        loggerService.info(`Target time: ${targetTime.toLocaleString()} for ${taskName}`)

        if (now >= targetTime) {
            // If the target time for today has passed, schedule for tomorrow
            loggerService.info(`Target time has passed for ${taskName}, scheduling for tomorrow`)
            targetTime.setDate(targetTime.getDate() + 1)
        }
        // Log when the next scheduled task will happen
        loggerService.info(`Next time ${taskName} will happen at: ${targetTime.toLocaleString()}`)

        const delay = targetTime.getTime() - now.getTime()

        setTimeout(async () => {
            loggerService.info(`Scheduled ${taskName} is starting at: ${new Date().toLocaleString()}`)
            try {
                await task()
                loggerService.info(`Scheduled ${taskName} completed.`)
            } catch (err) {
                loggerService.error(`Scheduled ${taskName} failed:`, err)
                throw err
            }
            scheduleNextRun() // Schedule the next run for tomorrow
        }, delay)
    }
    scheduleNextRun()
}