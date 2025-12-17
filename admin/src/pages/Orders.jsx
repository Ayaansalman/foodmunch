import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './Orders.css';

const API_URL = 'http://localhost:4000/api';

const statusOptions = [
    { value: 'pending', label: 'Pending', icon: '⏳' },
    { value: 'confirmed', label: 'Confirmed', icon: '✓' },
    { value: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
    { value: 'out_for_delivery', label: 'Out for Delivery', icon: '🚗' },
    { value: 'delivered', label: 'Delivered', icon: '✅' },
    { value: 'cancelled', label: 'Cancelled', icon: '❌' }
];

const Orders = ({ token }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Connect to Socket.io
        const newSocket = io('http://localhost:4000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            newSocket.emit('joinAdminRoom');
        });

        // Listen for new orders
        newSocket.on('newOrderReceived', (data) => {
            fetchOrders();
        });

        return () => newSocket.close();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_URL}/order/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token]);

    const updateStatus = async (orderId, newStatus, userId) => {
        try {
            const response = await fetch(`${API_URL}/order/admin/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();
            if (data.success) {
                // Update local state
                setOrders(orders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                ));

                // Emit socket event for real-time update
                if (socket) {
                    socket.emit('updateOrderStatus', {
                        orderId,
                        status: newStatus,
                        userId
                    });
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'warning',
            confirmed: 'info',
            preparing: 'primary',
            out_for_delivery: 'info',
            delivered: 'success',
            cancelled: 'error'
        };
        return colors[status] || 'primary';
    };

    if (loading) {
        return (
            <div className="orders-page-admin">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <div className="loader"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page-admin">
            <div className="page-header">
                <h1>Orders</h1>
                <p>Manage and track all customer orders in real-time</p>
            </div>

            {orders.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <span className="empty-icon">📦</span>
                        <h3>No Orders Yet</h3>
                        <p>Orders will appear here when customers place them</p>
                    </div>
                </div>
            ) : (
                <div className="orders-grid">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card card">
                            <div className="order-header">
                                <div>
                                    <h4>#{order._id.slice(-8).toUpperCase()}</h4>
                                    <span className="order-time">{formatDate(order.createdAt)}</span>
                                </div>
                                <span className={`badge badge-${getStatusColor(order.status)}`}>
                                    {statusOptions.find(s => s.value === order.status)?.icon} {order.status}
                                </span>
                            </div>

                            <div className="order-customer">
                                <strong>{order.deliveryAddress?.firstName} {order.deliveryAddress?.lastName}</strong>
                                <span>{order.deliveryAddress?.phone}</span>
                                <span className="order-address">
                                    📍 {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                                </span>
                            </div>

                            <div className="order-items-list">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="order-item-row">
                                        <span>{item.name}</span>
                                        <span>x{item.quantity}</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-footer">
                                <div className="order-total">
                                    <span>Total:</span>
                                    <strong>${order.totalAmount?.toFixed(2)}</strong>
                                </div>

                                <select
                                    className="input status-select"
                                    value={order.status}
                                    onChange={(e) => updateStatus(order._id, e.target.value, order.userId)}
                                >
                                    {statusOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.icon} {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
