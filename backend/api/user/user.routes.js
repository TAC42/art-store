import express from 'express'
import { log } from '../../middlewares/logger.middleware.js'
// import { getUsers, getUserById, removeUser, updateUser, addUser } from './user.controller.js'
import { getUsers, getUser, removeUser, updateUser, addUser } from './user.db.controller.js'

export const userRoutes = express.Router()

// middleware that is specific to this router
// userRoutes.use(requireAuth) // Uncomment if you want to require auth for all user routes

userRoutes.get('/', log, getUsers)
userRoutes.get('/:id', getUser)
userRoutes.put('/:id', updateUser)
userRoutes.post('/', addUser)
userRoutes.delete('/:id', removeUser)