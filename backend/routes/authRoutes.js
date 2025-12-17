import express from 'express';
import authService from '../services/authService.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validate('register'), async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            ...result
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validate('login'), async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json({
            success: true,
            message: 'Login successful',
            ...result
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticate, async (req, res, next) => {
    try {
        const user = await authService.getProfile(req.userId);
        res.json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, async (req, res, next) => {
    try {
        const user = await authService.updateProfile(req.userId, req.body);
        res.json({
            success: true,
            message: 'Profile updated',
            user
        });
    } catch (error) {
        next(error);
    }
});

export default router;
