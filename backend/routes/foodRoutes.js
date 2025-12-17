import express from 'express';
import multer from 'multer';
import foodService from '../services/foodService.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// @route   GET /api/food/list
// @desc    Get all food items
// @access  Public
router.get('/list', async (req, res, next) => {
    try {
        const { category } = req.query;
        const foods = await foodService.getAllFood({ category });
        res.json({
            success: true,
            data: foods
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/food/categories
// @desc    Get all categories
// @access  Public
router.get('/categories', (req, res) => {
    const categories = foodService.getCategories();
    res.json({
        success: true,
        data: categories
    });
});

// @route   GET /api/food/:id
// @desc    Get food by ID
// @access  Public
router.get('/:id', async (req, res, next) => {
    try {
        const food = await foodService.getFoodById(req.params.id);
        res.json({
            success: true,
            data: food
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/food/add
// @desc    Add new food item
// @access  Private/Admin
router.post('/add', authenticate, isAdmin, upload.single('image'), async (req, res, next) => {
    try {
        const food = await foodService.addFood(req.body, req.file);
        res.status(201).json({
            success: true,
            message: 'Food added successfully',
            data: food
        });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/food/:id
// @desc    Update food item
// @access  Private/Admin
router.put('/:id', authenticate, isAdmin, upload.single('image'), async (req, res, next) => {
    try {
        const food = await foodService.updateFood(req.params.id, req.body, req.file);
        res.json({
            success: true,
            message: 'Food updated successfully',
            data: food
        });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/food/:id
// @desc    Delete food item
// @access  Private/Admin
router.delete('/:id', authenticate, isAdmin, async (req, res, next) => {
    try {
        await foodService.deleteFood(req.params.id);
        res.json({
            success: true,
            message: 'Food deleted successfully'
        });
    } catch (error) {
        next(error);
    }
});

// @route   PATCH /api/food/:id/toggle
// @desc    Toggle food availability
// @access  Private/Admin
router.patch('/:id/toggle', authenticate, isAdmin, async (req, res, next) => {
    try {
        const food = await foodService.toggleAvailability(req.params.id);
        res.json({
            success: true,
            message: `Food ${food.isAvailable ? 'available' : 'unavailable'}`,
            data: food
        });
    } catch (error) {
        next(error);
    }
});

export default router;
