import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

// Import socket handler
import { initializeSocket } from './socket/socketHandler.js';

dotenv.config();

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174', 'http://100.25.217.141:5173', 'http://100.25.217.141:5174'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
});

// Make io accessible in routes
app.set('io', io);

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://100.25.217.141:5173', 'http://100.25.217.141:5174'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded images
app.use('/images', express.static('uploads'));

// Connect to Database
connectDB();

// Initialize Socket.io handlers
initializeSocket(io);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Food Delivery API v2.0 - Running',
        endpoints: {
            auth: '/api/auth',
            food: '/api/food',
            cart: '/api/cart',
            order: '/api/order'
        }
    });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   🍕 Food Delivery API Server              ║
║   Running on: http://localhost:${PORT}        ║
║   Socket.io: Enabled                       ║
╚════════════════════════════════════════════╝
  `);
});

export { io };
