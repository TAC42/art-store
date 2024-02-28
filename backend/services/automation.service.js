import { productService } from "../api/product/product.service.js"
import { utilService } from "./util.service.js"
import { loggerService } from "./logger.service.js"

// export function setupOrphanedImageCheck() {
//     loggerService.info('Orphaned image check will commence in 5 mins')
//     setInterval(async () => {
//         try {
//             loggerService.info('Starting automated check for orphaned images...')
//             await productService.checkRedundantProductImages()
//             loggerService.info('Automated check for orphaned images completed.')
//         } catch (err) {
//             loggerService.error('Automated check for orphaned images failed:', err)
//         }
//     }, 300000) // 300000 milliseconds = 5 minutes
// }

// export function setupOrphanedImageCheck() {
//     // Assuming Jerusalem is UTC+2 (adjust for daylight saving as necessary)
//     const timezoneOffset = +2 // UTC+2 -> -2 hours from UTC

//     utilService.scheduleTask(
//         productService.checkRedundantProductImages, // The task function to execute
//         14, // Hour (14:00)
//         25, // Minute (14:15)
//         timezoneOffset // Timezone offset
//     )
// }

export function setupOrphanedImageCheck() {
    utilService.scheduleTask(
        productService.checkRedundantProductImages,
        18,
        0)
}