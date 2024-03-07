import { Request, Response, NextFunction } from 'express'
import { User } from '../models/user.js'
import { loggerService } from '../services/logger.service.js'
import { authService } from '../api/auth/auth.service.js'

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    if (!req.cookies?.loginToken) return res.status(401).send('Not Authenticated')

    const loggedinUser = authService.validateToken(
        req.cookies.loginToken) as User | null
    if (!loggedinUser) return res.status(401).send('Not Authenticated')

    // @ts-ignore: Object is possibly 'null'
    req.loggedinUser = loggedinUser
    next()
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    if (!req.cookies?.loginToken) return res.status(401).send('Not Authenticated')

    const loggedinUser = authService.validateToken(
        req.cookies.loginToken) as User | null

    if (!loggedinUser || !loggedinUser.isAdmin) {
        loggerService.warn(`${loggedinUser?.username} attempted to perform admin action`)
        return res.status(403).end('Not Authorized')
    }
    next()
}