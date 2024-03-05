import { Request, Response, NextFunction } from 'express'
import { loggerService } from '../services/logger.service.js'

export async function log(req: Request, res: Response, next: NextFunction): Promise<void> {
    loggerService.info('Req was made', req.route?.path)
    next()
}

// export async function log(req, res, next) {
//     loggerService.info('Req was made', req.route.path)
//     next()
// }