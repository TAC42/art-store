import { productService } from "../api/product/product.service.js"
import { userService } from "../api/user/user.service.js"
import { loggerService } from "./logger.service.js"

export const automationService = {
    setupOrphanedImageCheck,
    setupUnverifiedUsersCheck
}

function setupOrphanedImageCheck() {
    scheduleTask(
        productService.checkRedundantProductImages,
        'Orphaned Images Check', 18, 0)
}

function setupUnverifiedUsersCheck() {
    scheduleTask(
        userService.checkNonVerifiedUsers,
        'Non Verified Users Check', 18, 30)
}

function scheduleTask(task, taskName, hour, minute) {
    loggerService.debug('Scheduling task called', taskName)

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