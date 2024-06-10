import express from 'express';
import { login, register, resetPassword } from '../Controllers/authController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Create user with file upload
router.post('/register', upload.single('avatar'), register);
router.post('/login', login);
router.post('/reset-password', resetPassword);

export default router;
