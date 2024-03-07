import { productService } from "../api/product/product.service.js"
import { userService } from "../api/user/user.service.js"
import { loggerService } from "./logger.service.js"

export const automationService = {
    setupOrphanedImageCheck,
    setupUnverifiedUsersCheck
}

function setupOrphanedImageCheck(): void {
    _scheduleTask(productService.checkRedundantProductImages,
        'Orphaned Images Check', 22, 5)
}

function setupUnverifiedUsersCheck(): void {
    _scheduleTask(userService.checkNonVerifiedUsers,
        'Non Verified Users Check', 22, 6)
}

function _scheduleTask(task: () => Promise<any>, taskName: string, hour: number, minute: number): void {
    loggerService.debug('Scheduling task called', taskName)

    const scheduleNextRun = () => {
        const now = new Date()
        let targetTime = new Date(now.getFullYear(), now.getMonth(),
            now.getDate(), hour, minute, 0)
        loggerService.info(`Target time: ${targetTime.toLocaleString()}`)

        if (now >= targetTime) {
            // If the target time for today has passed, schedule for tomorrow
            loggerService.info('Target time has passed, scheduling for tomorrow')
            targetTime.setDate(targetTime.getDate() + 1)
        }

        // Log when the next scheduled task will happen
        loggerService.info(`Next time will happen at: ${targetTime.toLocaleString()}`)

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