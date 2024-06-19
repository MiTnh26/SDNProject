import express from 'express';
import { deleteUser, getAllUser, getSingleUser, updateUser } from '../Controllers/userController.js';
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Update user with file upload
router.put('/:id', verifyUser, upload.single('avatar'), updateUser);

// Delete user
router.delete('/:id', verifyUser, deleteUser);

// Get single user
router.get('/:id', verifyUser, getSingleUser);

// Get all users
router.get('/', verifyAdmin, getAllUser);

export default router;
