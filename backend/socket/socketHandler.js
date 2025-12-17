// Socket.io handler for real-time order tracking
export const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`📱 Client connected: ${socket.id}`);

        // Join user-specific room for personalized updates
        socket.on('joinUserRoom', (userId) => {
            socket.join(`user:${userId}`);
            console.log(`👤 User ${userId} joined their room`);
        });

        // Join admin room
        socket.on('joinAdminRoom', () => {
            socket.join('admin');
            console.log(`👑 Admin joined admin room: ${socket.id}`);
        });

        // Handle order status update from admin
        socket.on('updateOrderStatus', async (data) => {
            const { orderId, status, userId } = data;

            // Broadcast to all admins
            io.to('admin').emit('orderStatusChanged', {
                orderId,
                status,
                updatedAt: new Date()
            });

            // Notify specific user about their order
            if (userId) {
                io.to(`user:${userId}`).emit('myOrderUpdate', {
                    orderId,
                    status,
                    updatedAt: new Date()
                });
            }

            console.log(`📦 Order ${orderId} status updated to: ${status}`);
        });

        // Handle new order notification
        socket.on('newOrder', (orderData) => {
            // Notify all admins about new order
            io.to('admin').emit('newOrderReceived', orderData);
            console.log(`🆕 New order received: ${orderData.orderId}`);
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log(`📴 Client disconnected: ${socket.id}`);
        });

        // Error handling
        socket.on('error', (error) => {
            console.error(`❌ Socket error: ${error}`);
        });
    });

    console.log('🔌 Socket.io initialized');
};
