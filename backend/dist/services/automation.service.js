import { productService } from "../api/product/product.service.js";
import { userService } from "../api/user/user.service.js";
import { loggerService } from "./logger.service.js";
export const automationService = {
    setupOrphanedImageCheck,
    setupUnverifiedUsersCheck
};
function setupOrphanedImageCheck() {
    _scheduleTask(productService.checkRedundantProductImages, 'Orphaned Images Check', 22, 5);
}
function setupUnverifiedUsersCheck() {
    _scheduleTask(userService.checkNonVerifiedUsers, 'Non Verified Users Check', 22, 6);
}
function _scheduleTask(task, taskName, hour, minute) {
    const scheduleNextRun = () => {
        const now = new Date();
        let targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);
        loggerService.info(`Target time: ${targetTime.toLocaleString()} for ${taskName}`);
        if (now >= targetTime) {
            // If the target time for today has passed, schedule for tomorrow
            loggerService.info(`Target time has passed for ${taskName}, scheduling for tomorrow`);
            targetTime.setDate(targetTime.getDate() + 1);
        }
        // Log when the next scheduled task will happen
        loggerService.info(`Next time ${taskName} will happen at: ${targetTime.toLocaleString()}`);
        const delay = targetTime.getTime() - now.getTime();
        setTimeout(async () => {
            loggerService.info(`Scheduled ${taskName} is starting at: ${new Date().toLocaleString()}`);
            try {
                await task();
                loggerService.info(`Scheduled ${taskName} completed.`);
            }
            catch (err) {
                loggerService.error(`Scheduled ${taskName} failed:`, err);
                throw err;
            }
            scheduleNextRun(); // Schedule the next run for tomorrow
        }, delay);
    };
    scheduleNextRun();
}
