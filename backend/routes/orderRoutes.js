import express from 'express';
import orderService from '../services/orderService.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/order/create
// @desc    Create new order
// @access  Private
router.post('/create', authenticate, async (req, res, next) => {
    try {
        // Pass Socket.io instance to order service
        const io = req.app.get('io');
        orderService.setSocketIO(io);

        const result = await orderService.createOrder(req.userId, req.body);
        res.status(201).json({
            success: true,
            message: 'Order created',
            orderId: result.order._id,
            sessionUrl: result.sessionUrl
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/order/verify
// @desc    Verify payment
// @access  Public (called by redirect)
router.post('/verify', async (req, res, next) => {
    try {
        const io = req.app.get('io');
        orderService.setSocketIO(io);

        const { orderId, success } = req.body;
        const result = await orderService.verifyPayment(orderId, success);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/order/my-orders
// @desc    Get user's orders
// @access  Private
router.get('/my-orders', authenticate, async (req, res, next) => {
    try {
        const orders = await orderService.getUserOrders(req.userId);
        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/order/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', authenticate, async (req, res, next) => {
    try {
        const order = await orderService.getOrderById(req.params.id, req.userId);
        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
});

// ========== ADMIN ROUTES ==========

// @route   GET /api/order/admin/all
// @desc    Get all orders (admin)
// @access  Private/Admin
router.get('/admin/all', authenticate, isAdmin, async (req, res, next) => {
    try {
        const orders = await orderService.getAllOrders();
        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/order/admin/stats
// @desc    Get order statistics (admin)
// @access  Private/Admin
router.get('/admin/stats', authenticate, isAdmin, async (req, res, next) => {
    try {
        const stats = await orderService.getOrderStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/order/admin/:id/status
// @desc    Update order status (admin)
// @access  Private/Admin
router.put('/admin/:id/status', authenticate, isAdmin, async (req, res, next) => {
    try {
        const io = req.app.get('io');
        orderService.setSocketIO(io);

        const { status } = req.body;
        const order = await orderService.updateOrderStatus(req.params.id, status);
        res.json({
            success: true,
            message: 'Order status updated',
            data: order
        });
    } catch (error) {
        next(error);
    }
});

export default router;
