import express from 'express';
import { log } from '../../middlewares/logger.middleware.js';
import { getUsers, getUserById, removeUser, updateUser, addUser } from './user.controller.js';
export const userRoutes = express.Router();
// middleware that is specific to this router
// userRoutes.use(requireAuth) // Uncomment if you want to require auth for all user routes
userRoutes.get('/', log, getUsers);
userRoutes.get('/by-id/:id', getUserById);
userRoutes.post('/add/', addUser);
userRoutes.put('/update/:id', updateUser);
userRoutes.delete('/delete/:id', removeUser);
