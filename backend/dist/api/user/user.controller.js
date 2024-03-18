import express from 'express';
import { log } from '../../middlewares/logger.middleware.js';
// user routes
export const userRoutes = express.Router();
// middleware that is specific to this router
// userRoutes.use(requireAuth) // Uncomment if you want to require auth for all user routes
userRoutes.get('/', log, _getUsers);
userRoutes.get('/by-id/:id', _getUserById);
userRoutes.post('/add/', _addUser);
userRoutes.put('/update/:id', _updateUser);
userRoutes.delete('/delete/:id', _removeUser);
import { loggerService } from '../../services/logger.service.js';
import { userService } from './user.service.js';
async function _getUsers(req, res) {
    try {
        const users = await userService.query(req.query);
        res.json(users);
    }
    catch (err) {
        loggerService.error('Cannot get users', err);
        res.status(500).send({ err: 'Failed to get users' });
    }
}
async function _getUserById(req, res) {
    try {
        const user = await userService.getById(req.params.id);
        res.json(user);
    }
    catch (err) {
        loggerService.error('Failed to get user', err);
        res.status(500).send({ err: 'Failed to get user' });
    }
}
async function _addUser(req, res) {
    try {
        const user = req.body;
        loggerService.debug('Creating user:', user);
        const addedUser = await userService.save(user);
        res.json(addedUser);
    }
    catch (err) {
        loggerService.error('Failed to add user', err);
        res.status(500).send({ err: 'Failed to add user' });
    }
}
async function _updateUser(req, res) {
    try {
        const user = { ...req.body, _id: req.params.id };
        loggerService.debug('Updating user:', user);
        const savedUser = await userService.save(user);
        res.json(savedUser);
    }
    catch (err) {
        loggerService.error('Failed to update user', err);
        res.status(500).send({ err: 'Failed to update user' });
    }
}
async function _removeUser(req, res) {
    try {
        const userId = req.params.id;
        loggerService.debug('Removing user with _id: ', userId);
        await userService.remove(userId);
        res.status(200).send({ msg: 'User successfully removed' });
    }
    catch (err) {
        loggerService.error('Failed to delete user', err);
        res.status(400).send({ err: 'Failed to delete user' });
    }
}
