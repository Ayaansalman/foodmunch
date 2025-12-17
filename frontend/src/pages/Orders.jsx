import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { orderAPI } from '../services/api';
import './Orders.css';

const statusConfig = {
    pending: { label: 'Pending', color: 'warning', icon: '⏳' },
    confirmed: { label: 'Confirmed', color: 'info', icon: '✓' },
    preparing: { label: 'Preparing', color: 'primary', icon: '👨‍🍳' },
    out_for_delivery: { label: 'Out for Delivery', color: 'info', icon: '🚗' },
    delivered: { label: 'Delivered', color: 'success', icon: '✅' },
    cancelled: { label: 'Cancelled', color: 'error', icon: '❌' }
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const { orderUpdates, clearOrderUpdates } = useSocket();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await orderAPI.getMyOrders();
                if (response.data.success) {
                    setOrders(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, navigate]);

    // Handle real-time updates
    useEffect(() => {
        if (orderUpdates.length > 0) {
            orderUpdates.forEach((update) => {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === update.orderId
                            ? { ...order, status: update.status }
                            : order
                    )
                );
            });
            clearOrderUpdates();
        }
    }, [orderUpdates, clearOrderUpdates]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="orders-page">
                <div className="container">
                    <div className="loader-overlay" style={{ position: 'static', background: 'transparent' }}>
                        <div className="loader"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="orders-page">
                <div className="container">
                    <div className="empty-orders">
                        <span className="empty-icon">📦</span>
                        <h2>No Orders Yet</h2>
                        <p>You haven't placed any orders yet</p>
                        <Link to="/menu" className="btn btn-primary btn-lg mt-lg">
                            Start Ordering
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="container">
                <div className="page-header">
                    <h1>My Orders</h1>
                    <p>Track your order status in real-time</p>
                </div>

                <div className="orders-list">
                    {orders.map((order) => {
                        const status = statusConfig[order.status] || statusConfig.pending;

                        return (
                            <div key={order._id} className="order-card card">
                                <div className="order-header">
                                    <div className="order-info">
                                        <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                                        <span className="order-date">{formatDate(order.createdAt)}</span>
                                    </div>
                                    <div className={`order-status badge badge-${status.color}`}>
                                        <span>{status.icon}</span>
                                        <span>{status.label}</span>
                                    </div>
                                </div>

                                <div className="order-items">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="order-item">
                                            <img
                                                src={item.image?.startsWith('http') ? item.image : `http://localhost:4000/images/${item.image}`}
                                                alt={item.name}
                                            />
                                            <div className="item-info">
                                                <span className="item-name">{item.name}</span>
                                                <span className="item-qty">x{item.quantity}</span>
                                            </div>
                                            <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <div className="order-address">
                                        <span className="address-label">📍 Delivery to:</span>
                                        <span>{order.deliveryAddress.street}, {order.deliveryAddress.city}</span>
                                    </div>
                                    <div className="order-total">
                                        <span>Total:</span>
                                        <span className="total-amount">${order.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Status Tracker */}
                                {order.status !== 'cancelled' && (
                                    <div className="status-tracker">
                                        {['confirmed', 'preparing', 'out_for_delivery', 'delivered'].map((step, index) => {
                                            const stepStatus = statusConfig[step];
                                            const stepOrder = ['confirmed', 'preparing', 'out_for_delivery', 'delivered'];
                                            const currentIndex = stepOrder.indexOf(order.status);
                                            const isCompleted = index <= currentIndex;
                                            const isCurrent = step === order.status;

                                            return (
                                                <div
                                                    key={step}
                                                    className={`tracker-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                                                >
                                                    <div className="step-icon">{stepStatus.icon}</div>
                                                    <span className="step-label">{stepStatus.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Orders;
