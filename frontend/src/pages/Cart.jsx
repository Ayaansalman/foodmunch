import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart, addToCart, deleteFromCart, loading } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <span className="empty-icon">🔒</span>
                        <h2>Please Sign In</h2>
                        <p>You need to sign in to view your cart</p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="loader-overlay" style={{ position: 'static', background: 'transparent' }}>
                        <div className="loader"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (cart.items.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <span className="empty-icon">🛒</span>
                        <h2>Your Cart is Empty</h2>
                        <p>Add some delicious items to get started!</p>
                        <Link to="/menu" className="btn btn-primary btn-lg mt-lg">
                            Browse Menu
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <div className="page-header">
                    <h1>Your Cart</h1>
                    <p>{cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}</p>
                </div>

                <div className="cart-layout">
                    <div className="cart-items-section">
                        <div className="cart-items-header">
                            <span>Items</span>
                            <span>Title</span>
                            <span>Price</span>
                            <span>Qty</span>
                            <span>Total</span>
                            <span></span>
                        </div>

                        {cart.items.map((item) => (
                            <div key={item.foodId} className="cart-item">
                                <img
                                    src={item.image?.startsWith('http') ? item.image : `http://localhost:4000/images/${item.image}`}
                                    alt={item.name}
                                    className="cart-item-image"
                                />
                                <span className="cart-item-name">{item.name}</span>
                                <span className="cart-item-price">${item.price.toFixed(2)}</span>
                                <div className="cart-item-qty">
                                    <button
                                        className="qty-btn-small"
                                        onClick={() => removeFromCart(item.foodId)}
                                    >
                                        −
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        className="qty-btn-small"
                                        onClick={() => addToCart(item.foodId)}
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="cart-item-total">${item.total.toFixed(2)}</span>
                                <button
                                    className="cart-item-remove"
                                    onClick={() => deleteFromCart(item.foodId)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary-section">
                        <div className="cart-summary card">
                            <h3>Order Summary</h3>

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
                                className="btn btn-primary w-full btn-lg"
                                onClick={() => navigate('/order')}
                            >
                                Proceed to Checkout
                            </button>

                            <div className="promo-section">
                                <p>Have a promo code?</p>
                                <div className="promo-input">
                                    <input type="text" className="input" placeholder="Enter code" />
                                    <button className="btn btn-secondary">Apply</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
