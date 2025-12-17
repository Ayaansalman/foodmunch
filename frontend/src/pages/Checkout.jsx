import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import './Checkout.css';

const Checkout = () => {
    const { cart, refreshCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: user?.email || '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const orderData = {
                items: cart.items.map(item => ({
                    foodId: item.foodId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                })),
                deliveryAddress: formData
            };

            const response = await orderAPI.create(orderData);

            if (response.data.success && response.data.sessionUrl) {
                // Redirect to Stripe checkout
                window.location.href = response.data.sessionUrl;
            } else {
                setError(response.data.message || 'Failed to create order');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        navigate('/');
        return null;
    }

    if (cart.items.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <div className="page-header">
                    <h1>Checkout</h1>
                    <p>Enter your delivery details</p>
                </div>

                <div className="checkout-layout">
                    <form onSubmit={handleSubmit} className="checkout-form">
                        <h3>Delivery Information</h3>

                        <div className="form-row">
                            <div className="input-group">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    className="input"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    className="input"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="input"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="phone">Phone</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="input"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="street">Street Address</label>
                            <input
                                type="text"
                                id="street"
                                name="street"
                                className="input"
                                value={formData.street}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row form-row-3">
                            <div className="input-group">
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    className="input"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="state">State</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    className="input"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="zipCode">ZIP Code</label>
                                <input
                                    type="text"
                                    id="zipCode"
                                    name="zipCode"
                                    className="input"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {error && <p className="error-message">{error}</p>}
                    </form>

                    <div className="order-summary card">
                        <h3>Order Summary</h3>

                        <div className="summary-items">
                            {cart.items.map((item) => (
                                <div key={item.foodId} className="summary-item">
                                    <img
                                        src={item.image?.startsWith('http') ? item.image : `http://localhost:4000/images/${item.image}`}
                                        alt={item.name}
                                    />
                                    <div className="item-details">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-qty">x{item.quantity}</span>
                                    </div>
                                    <span className="item-price">${item.total.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${cart.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery Fee</span>
                            <span>${cart.deliveryFee.toFixed(2)}</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${cart.total.toFixed(2)}</span>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            className="btn btn-primary w-full btn-lg"
                            disabled={loading}
                            onClick={handleSubmit}
                        >
                            {loading ? (
                                <span className="loader" style={{ width: '20px', height: '20px' }}></span>
                            ) : (
                                `Pay $${cart.total.toFixed(2)}`
                            )}
                        </button>

                        <p className="payment-note">
                            🔒 Secure payment via Stripe
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
