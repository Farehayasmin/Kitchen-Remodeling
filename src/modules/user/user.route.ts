import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();

// Authentication routes
router.post('/register', UserController.createUser);
router.post('/login', UserController.loginUser);

// User statistics
router.get('/statistics', UserController.getUserStatistics);

// Get all users (with optional filters)
router.get('/', UserController.getAllUsers);

// Get user by email
router.get('/email/:email', UserController.getUserByEmail);

// Get single user by ID
router.get('/:id', UserController.getUserById);

// Update user
router.put('/:id', UserController.updateUser);

// Update user status
router.patch('/:id/status', UserController.updateUserStatus);

// Change password
router.patch('/:id/change-password', UserController.changePassword);

// Delete user
router.delete('/:id', UserController.deleteUser);

export const userRoutes = router;