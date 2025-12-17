import express from 'express';
import cartService from '../services/cartService.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', async (req, res, next) => {
    try {
        const cart = await cartService.getCart(req.userId);
        res.json({
            success: true,
            data: cart
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', async (req, res, next) => {
    try {
        const { foodId } = req.body;
        const cart = await cartService.addToCart(req.userId, foodId);
        res.json({
            success: true,
            message: 'Item added to cart',
            data: cart
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/cart/remove
// @desc    Remove item from cart (decrease quantity)
// @access  Private
router.post('/remove', async (req, res, next) => {
    try {
        const { foodId } = req.body;
        const cart = await cartService.removeFromCart(req.userId, foodId);
        res.json({
            success: true,
            message: 'Item removed from cart',
            data: cart
        });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/cart/update
// @desc    Update item quantity
// @access  Private
router.put('/update', async (req, res, next) => {
    try {
        const { foodId, quantity } = req.body;
        const cart = await cartService.updateQuantity(req.userId, foodId, quantity);
        res.json({
            success: true,
            message: 'Cart updated',
            data: cart
        });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/cart/:foodId
// @desc    Delete item from cart completely
// @access  Private
router.delete('/:foodId', async (req, res, next) => {
    try {
        const cart = await cartService.deleteFromCart(req.userId, req.params.foodId);
        res.json({
            success: true,
            message: 'Item deleted from cart',
            data: cart
        });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', async (req, res, next) => {
    try {
        const cart = await cartService.clearCart(req.userId);
        res.json({
            success: true,
            message: 'Cart cleared',
            data: cart
        });
    } catch (error) {
        next(error);
    }
});

export default router;
