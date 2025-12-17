import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class OrderService {
    constructor() {
        this.io = null;
    }

    // Set Socket.io instance
    setSocketIO(io) {
        this.io = io;
    }

    // Create new order
    async createOrder(userId, orderData) {
        const { items, deliveryAddress } = orderData;

        // Calculate total
        const itemsTotal = items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        const deliveryFee = 2;
        const totalAmount = itemsTotal + deliveryFee;

        // Calculate estimated delivery (30-45 mins from now)
        const estimatedDelivery = new Date(Date.now() + 40 * 60 * 1000);

        const order = new Order({
            userId,
            items: items.map(item => ({
                foodId: item.foodId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            totalAmount,
            deliveryFee,
            deliveryAddress,
            estimatedDelivery,
            status: 'confirmed',  // Skip pending, go straight to confirmed
            paymentStatus: 'paid'  // Mark as paid for demo
        });

        await order.save();

        // Clear user's cart
        await Cart.findOneAndUpdate({ userId }, { items: [] });

        // Emit new order notification to admin
        if (this.io) {
            this.io.to('admin').emit('newOrderReceived', {
                orderId: order._id,
                message: 'New order received!'
            });
        }

        // Return direct success URL (bypassing Stripe for demo)
        return {
            order,
            sessionUrl: `http://localhost:5173/verify?success=true&orderId=${order._id}`
        };
    }

    // Verify payment
    async verifyPayment(orderId, success) {
        const order = await Order.findById(orderId);

        if (!order) {
            throw { status: 404, message: 'Order not found' };
        }

        if (success === 'true') {
            order.paymentStatus = 'paid';
            order.status = 'confirmed';
            await order.save();

            // Emit real-time update
            if (this.io) {
                this.io.emit('orderUpdate', {
                    orderId: order._id,
                    status: order.status,
                    paymentStatus: order.paymentStatus
                });
            }

            return { success: true, message: 'Payment successful', order };
        } else {
            order.paymentStatus = 'failed';
            order.status = 'cancelled';
            await order.save();
            return { success: false, message: 'Payment failed', order };
        }
    }

    // Get user's orders
    async getUserOrders(userId) {
        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 });
        return orders;
    }

    // Get all orders (admin)
    async getAllOrders() {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        return orders;
    }

    // Get order by ID
    async getOrderById(orderId, userId = null) {
        const query = { _id: orderId };
        if (userId) {
            query.userId = userId;
        }

        const order = await Order.findOne(query);
        if (!order) {
            throw { status: 404, message: 'Order not found' };
        }
        return order;
    }

    // Update order status (admin)
    async updateOrderStatus(orderId, status) {
        const order = await Order.findById(orderId);

        if (!order) {
            throw { status: 404, message: 'Order not found' };
        }

        const previousStatus = order.status;
        order.status = status;

        if (status === 'delivered') {
            order.deliveredAt = new Date();
        }

        await order.save();

        // Emit real-time update to all connected clients
        if (this.io) {
            this.io.emit('orderUpdate', {
                orderId: order._id,
                previousStatus,
                status: order.status,
                deliveredAt: order.deliveredAt
            });

            // Also emit to specific user room
            this.io.to(`user:${order.userId}`).emit('myOrderUpdate', {
                orderId: order._id,
                status: order.status
            });
        }

        return order;
    }

    // Get order statistics (admin)
    async getOrderStats() {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const preparingOrders = await Order.countDocuments({ status: 'preparing' });
        const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

        const revenueResult = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const totalRevenue = revenueResult[0]?.total || 0;

        return {
            totalOrders,
            pendingOrders,
            preparingOrders,
            deliveredOrders,
            totalRevenue
        };
    }
}

export default new OrderService();
