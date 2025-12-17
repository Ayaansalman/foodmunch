import { useState, useEffect } from 'react';
import './Dashboard.css';

const API_URL = 'http://localhost:4000/api';

const Dashboard = ({ token }) => {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch stats
                const statsRes = await fetch(`${API_URL}/order/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const statsData = await statsRes.json();
                if (statsData.success) {
                    setStats(statsData.data);
                }

                // Fetch recent orders
                const ordersRes = await fetch(`${API_URL}/order/admin/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const ordersData = await ordersRes.json();
                if (ordersData.success) {
                    setRecentOrders(ordersData.data.slice(0, 5));
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    if (loading) {
        return (
            <div className="dashboard-page">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <div className="loader"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Welcome back! Here's an overview of your restaurant.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card card">
                    <span className="stat-icon">📦</span>
                    <div className="stat-value">{stats?.totalOrders || 0}</div>
                    <div className="stat-label">Total Orders</div>
                </div>

                <div className="stat-card card">
                    <span className="stat-icon">⏳</span>
                    <div className="stat-value">{stats?.pendingOrders || 0}</div>
                    <div className="stat-label">Pending Orders</div>
                </div>

                <div className="stat-card card">
                    <span className="stat-icon">👨‍🍳</span>
                    <div className="stat-value">{stats?.preparingOrders || 0}</div>
                    <div className="stat-label">Preparing</div>
                </div>

                <div className="stat-card card">
                    <span className="stat-icon">💰</span>
                    <div className="stat-value">${stats?.totalRevenue?.toFixed(2) || '0.00'}</div>
                    <div className="stat-label">Total Revenue</div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Recent Orders</h3>

                {recentOrders.length > 0 ? (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td>#{order._id.slice(-8).toUpperCase()}</td>
                                        <td>{order.deliveryAddress?.firstName} {order.deliveryAddress?.lastName}</td>
                                        <td>{order.items?.length || 0} items</td>
                                        <td>${order.totalAmount?.toFixed(2)}</td>
                                        <td>
                                            <span className={`badge badge-${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <span className="empty-icon">📭</span>
                        <p>No orders yet</p>
                    </div>
                )}
            </div>
        </div>
    );
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

export default Dashboard;
